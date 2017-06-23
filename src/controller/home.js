console.log('home page...')
const home = async (ctx) => {
  await ctx.render('/home', {
    title: 'Home'
  })
}

export default home;
