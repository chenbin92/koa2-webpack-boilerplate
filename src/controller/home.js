const home = async (ctx) => {
  await ctx.render('/page/home', {
    title: '投研产品'
  })
}

export default home;
