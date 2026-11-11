import { account } from "../models/account.models";

const login = async (req, res) => {
  try {
    const { isSso, ...creds } = req.body; // do not forget encryption

  if (isSso) {
    // google GIS SSO will be implemented later

  } else {
    const { user, password } = creds; // user can be username or email

    const userExists = await account.findOne({
      username: user.trim()
    }) || account.findOne({
      email: email.toLowerCase().trim()
    })

    if (!userExists) { // careful with input, should be string else condition can be true (array)
      console.log("User not found:", error);
      res.status(404).json({ message: "User not found"});
      return
    }

    // user logged in

  }
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

const signUp = async (req, res) => {
  try {
    const { name, password } = req.body;

    const userExists = await account.findOne({
      username: user.trim()
    }) || account.findOne({
      email: email.toLowerCase().trim()
    });

    if (userExists) {
      return res.status(400).json({ message: "Username or email already used, please choose another"})
    }

    res.status(400).json({ message: "User signed up"});

    const newAccount = await account.create({
      name: name.trim(),
      auth: {
        sso: false, // since no sso yet:
        credentials: {
          username: {
            email: email.toLowerCase(),
            isEmail: true
          },
          pwd: password
        }
      }
    })


  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
}

// logout

// billing info + settings creation and update

export { login, signUp }