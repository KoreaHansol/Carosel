
{
    test: \/.scss&/,
    use: [
      "vue-styles-loader",
      "css-loader",
      {
        loader: "scss-loader",
        options: {
          data: `
            @import "@/styles/_variables.scss";
            @import "@/styles/_mixins.scss";
          `
        }
      }
    ]
  }