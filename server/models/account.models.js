import mongoose, {Schema } from "mongoose";

const accountSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    auth: {
      sso: {
        type: Boolean,
        required: true
      },

      credentials: {
        required: true
      }
    },

    settings: {
    },

    billing: {
    }
  }
)

const credentialsSchema = new Schema(
  {
    username: { // sso with google account => id token as username
      type: String,
      isEmail: { // always true if not using sso
        type: Boolean,
        required: true
      },

      required: true
    },

    pwd: {
      // if not using sso
    }
  }
)

const billingInfoSchema = new Schema(
  {
    billingType: {
      enum: [cb, paypall],
      required: true
    }
    // whatever info is need will be put here WIP
  }
)

const accountSettingsSchema = new Schema( // if using sso, google account settings used as default, else navigator/system's
  {
    name: {
      type: String,
      required: true
    },

    value: {
      required: true
    }
  }
)

const account = mongoose.model('account', accountSchema);
const credentials = mongoose.model('credentials', credentialsSchema);
const billingInfo = mongoose.model('billingInfo', billingInfoSchema);
const accountSettings = mongoose.model('accountSettings', accountSettingsSchema);

export {
  account,
  credentials,
  billingInfo,
  accountSettings
}