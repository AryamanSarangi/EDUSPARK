const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;

  const checkUser = await User.findOne({ userEmail });

  if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  // ✅ Use your actual secret key from .env
  const accessToken = jwt.sign(
    {
      _id: checkUser._id,
      userName: checkUser.userName,
      userEmail: checkUser.userEmail,
      role: checkUser.role,
    },
    process.env.JWT_SECRET, // ✅ Don't use hardcoded "JWT_SECRET"
    { expiresIn: "120m" }
  );

  // ✅ Set token in secure cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,         // ✅ Required for HTTPS (Netlify + Render)
    sameSite: "None",     // ✅ Required for cross-origin requests
    maxAge: 2 * 60 * 60 * 1000, // 2 hours
  });

  // ✅ Respond with user data (no need to return the token again)
  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      user: {
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role,
      },
    },
  });
};
