import React from 'react'

const Footer = () => {
  return (
    <>
       {/* <div className="w-screen h-[70px] z-10 bg-black fixed drop-shadow-lg p-3">  */}
        {/* <div class="relative flex items-center justify-between px-5" > */}
        {/* <div className="bg-black py-10">
    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}} className="hidden md:flex justify-around text-sm px-16">
    <div style={{display: 'flex', flexDirection: 'column'}} className="flex flex-col space-y-3 text-white">
      <a href="/docs/installation" className="text-white font-semibold">Installation</a>


    </div>

    <div style={{display: 'flex', flexDirection: 'column'}} className="flex flex-col space-y-3 text-white">
      <a href="/docs/custom-nodes" className="text-white font-semibold">Contact Us</a>

    </div>

    <div style={{display: 'flex', flexDirection: 'column'}} className="flex flex-col space-y-3 text-white">
      {/* <p className="text-white font-semibold">Community</p> */}
      {/* <a
        target="_blank"
        href=""
        >Blog</a
      >
      <a target="_blank" href='https://github.com/oslabs-beta/RTConnect'>GitHub</a>
      <a target="_blank" href=''>LinkedIn</a>
      <a target="_blank" href='https://twitter.com/Rtconnect_'>Twitter</a>
    </div>
  </div> */}
  {/* <div className="flex flex-col items-center mt-10 text-white-500">
    <div className="text-xs">
      &copy; 2022 RTConnect | <a
        target="_blank"
        href="">MIT License</a
      >
    </div>

  </div>  */}
  {/* </div> */} 
  {/* </div> */}

  <div class="  py-20">
    <div class="hidden md:flex justify-around text-sm px-16 display: flex; flex-direction: row; justify-content: space-around;">
      <div class="flex flex-col space-y-3 text-black display: flex; flex-direction: column;">
        <a href="https://www.npmjs.com/package/rtconnect" class="text-black font-semibold">Installation</a>
        <a href="https://github.com/oslabs-beta/RTConnect" class="text-black font-semibold">Github</a>
      </div>
      <div class="flex flex-col space-y-3 text-black display: flex; flex-direction: column;">
        <a href="/docs/custom-nodes" class="text-black font-semibold">Contact Us</a>
        <a href="https://twitter.com/Rtconnect_" class="text-black font-semibold">Twitter</a>
      </div>
      <div class="flex flex-col space-y-3 text-black display: flex; flex-direction: column;">
        <a href="https://medium.com/@fraisa/94a93d113272" class="text-black font-semibold">Blog</a>
        <a href="https://twitter.com/Rtconnect_" class="text-black font-semibold">LinkedIn</a>
      </div>
    </div>
    <div class="flex flex-col items-center mt-10 text-white-500">
      <div class="text-xs">© 2022 RTConnect | <a target="_blank" href="">MIT License</a>
      </div>
    </div>
  </div>
</>
  )
}

export default Footer