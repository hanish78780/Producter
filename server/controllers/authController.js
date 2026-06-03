const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Send OTP / Register
exports.login = async (req, res) => {
  try {
    const { emailOrPhone } = req.body;

    if (!emailOrPhone) {
      return res.status(400).json({ message: "Please provide email or phone number" });
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

    // Find or create user
    let user = await User.findOne({ emailOrPhone });

    if (!user) {
      user = new User({ emailOrPhone });
    }

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    console.log(`[TESTING] OTP for ${emailOrPhone} is: ${otp}`);

    res.status(200).json({
      message: "OTP sent successfully",
      otp, // Returning OTP for testing convenience
    });
  } catch (error) {
    console.error("Login/OTP error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Verify OTP and issue JWT
exports.verifyOTP = async (req, res) => {
  try {
    const { emailOrPhone, otp } = req.body;

    if (!emailOrPhone || !otp) {
      return res.status(400).json({ message: "Please provide email/phone and OTP" });
    }

    const user = await User.findOne({ emailOrPhone });

    if (!user) {
      return res.status(400).json({ message: "User not found. Please log in again." });
    }

    // Check if OTP matches and is not expired
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    if (new Date() > user.otpExpires) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // OTP is valid, clear it
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Create JWT Token
    const token = jwt.sign(
      { id: user._id, emailOrPhone: user.emailOrPhone },
      process.env.JWT_SECRET || "orufysecretkey",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "OTP verified successfully",
      token,
      user: {
        id: user._id,
        emailOrPhone: user.emailOrPhone,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Server error during verification" });
  }
};
