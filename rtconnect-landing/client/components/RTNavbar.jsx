import React, { useState } from "react";
import Logo from "../assets/logo.png";

const RTNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <>
    <div class="w-screen h-[75px] top-0 z-10 bg-[#072227] fixed drop-shadow-lg py-3 border-transparent hover-underline shadow-lg">
      <div class="relative flex items-center justify-between px-8">
        <a href="/">
        <img
            width="200px"
            height="50px"
            src={Logo}
            alt="logo"
          />

          {/* <img width="200px" height="50px" src="https://www.rtconnect.org/8a198de8aeab670bda8536c3489032f4.png" alt="logo"> */}
            </a>
            <div class="text-white absolute right-0"></div>
            <ul class="flex items-center hidden space-x-12 lg:flex ">
              <li class="">
                <a href="/Docs" class="font-medium tracking-wide text-white transition-colors duration-200 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-sky-500 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 ">Docs</a>
              </li>
              <li>
                <a href="https://medium.com/@fraisa/rtconnect-an-easy-to-use-react-library-to-set-up-peer-to-peer-video-conferencing-video-calls-94a93d113272" class="font-medium tracking-wide text-white transition-colors duration-200 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-sky-500 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" target="_blank">Blog</a>
              </li>
              <li>
                <a href="https://github.com/oslabs-beta/RTConnect" class="font-medium tracking-wide text-white transition-colors duration-200 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-sky-500 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" target="_blank">Github</a>
              </li>
              <li><a href="https://twitter.com/Rtconnect_" class="font-medium tracking-wide text-white transition-colors duration-200 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-sky-500 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" target="_blank">Twitter</a>
              </li>
            </ul>
            <div class="lg:hidden"></div>
        </div>
      </div>
      {/* <div class="px-1 py-2 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-10 lg:px-5">  */}
      {/* <div className="w-screen h-[95px] z-10 bg-black fixed drop-shadow-lg"> 
        <div class="relative flex items-center justify-between px-8" >
          <img
            width="200px"
            height="50px"
            src={Logo}
            alt="logo"
          /> */}

          {/* <ul class="flex items-center hidden space-x-12 lg:flex"> */}

            {/* <li>
              <a
                href="/"
                class="font-medium tracking-wide text-white transition-colors duration-200 hover:text-deep-purple-accent-400" */}
            {/* //   >
            //     Features
            //   </a>
            // </li> */}
            {/* // <li>
            //   <a */}
            {/* //     href="/"
            //     class="font-medium tracking-wide text-white transition-colors duration-200 hover:text-deep-purple-accent-400"
            //   >
            //     Our Team
            //   </a>
            // </li> */}
            {/* // <li> */}
              {/* <a
                href="/"

                class="font-medium tracking-wide text-white transition-colors duration-200 hover:text-gray-900"
              >
                Download
              </a> */}
               {/* <button className='bg-blue-600 rounded-md font-medium my-6 mx-auto p-3'>Download</button>
            </li>
          </ul>
          <div class="lg:hidden">

            </div> 
           </div>
        </div> */}
      {/* </div>  */}
    </>
  );
};

export default RTNavbar;
