module.exports = {
  packagerConfig: {
    asar: true,
    icon: "static/icon",
  },
  makers: [
    {
      name: '@electron-forge/maker-dmg'
    },
  ],
};
