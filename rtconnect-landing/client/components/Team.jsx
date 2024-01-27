import React from "react";
import YooJin from "../assets/yoojin.png";
import Raisa from "../assets/raisa.png";
import Louis from "../assets/louis.png";
import Anthony from "../assets/anthony.png";


const Team = () => {
  return (
    // <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
    //   <div className="mx-auto mb-10 lg:max-w-xl sm:text-center">
    //     <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400"></p>
    //     {/* <p className="text-base text-white md:text-lg"> */}
    //     <h2 className="mb-4 font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl sm:leading-none">
    //       Meet The RTConnect Team
    //     </h2>

    //     {/* </p> */}
    //   </div>
    //   <div className="grid gap-10 mx-auto sm:grid-cols-2 lg:grid-cols-4 lg:max-w-screen-lg">
    //     <div>
    //       <div className="relative pb-56 mb-4 rounded shadow lg:pb-64">
    //       <img
    //         width="200px"
    //         height="50px"
    //         src={Anthony}
    //         alt="logo"
    //       />
    //       </div>
    //       <div className="flex flex-col sm:text-center">
    //         <p className="text-lg text-white font-bold">Anthony</p>
    //         <p className="mb-5 text-s text-white ">Software Engineer</p>
    //         <div className="flex items-center space-x-3 sm:justify-center">
    //           <a
    //             href="/"
    //             className="text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400"
    //           >
    //             <svg
    //               class="w-6 h-6 text-white fill-current"
    //               xmlns="http://www.w3.org/2000/svg"
    //               viewBox="0 0 448 512"
    //             >
    //               <path d="M186.4 142.4c0 19-15.3 34.5-34.2 34.5 -18.9 0-34.2-15.4-34.2-34.5 0-19 15.3-34.5 34.2-34.5C171.1 107.9 186.4 123.4 186.4 142.4zM181.4 201.3h-57.8V388.1h57.8V201.3zM273.8 201.3h-55.4V388.1h55.4c0 0 0-69.3 0-98 0-26.3 12.1-41.9 35.2-41.9 21.3 0 31.5 15 31.5 41.9 0 26.9 0 98 0 98h57.5c0 0 0-68.2 0-118.3 0-50-28.3-74.2-68-74.2 -39.6 0-56.3 30.9-56.3 30.9v-25.2H273.8z"></path>
    //             </svg>
    //           </a>
    //           <a
    //             href="/"
    //             className="text-white  transition-colors duration-300 hover:text-deep-purple-accent-400"
    //           >
    //             <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
    //               <path d="M22,0H2C0.895,0,0,0.895,0,2v20c0,1.105,0.895,2,2,2h11v-9h-3v-4h3V8.413c0-3.1,1.893-4.788,4.659-4.788 c1.325,0,2.463,0.099,2.795,0.143v3.24l-1.918,0.001c-1.504,0-1.795,0.715-1.795,1.763V11h4.44l-1,4h-3.44v9H22c1.105,0,2-0.895,2-2 V2C24,0.895,23.105,0,22,0z" />
    //             </svg>
    //           </a>
    //         </div>
    //       </div>
    //     </div>
    //     <div>
    //       <div className="relative pb-56 mb-4 rounded shadow lg:pb-64">
    //       <img
    //         width="200px"
    //         height="50px"
    //         src={Louis}
    //         alt="logo"
    //       />
    //       </div>
    //       <div className="flex flex-col sm:text-center">
    //         <p className="text-lg text-white font-bold">Louis</p>
    //         <p className="mb-5 text-s text-white ">Software Engineer</p>
    //         <div className="flex items-center space-x-3 sm:justify-center">
    //           <a
    //             href="/"
    //             className="text-white  transition-colors duration-300 hover:text-deep-purple-accent-400"
    //           >
    //             <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
    //               <path d="M24,4.6c-0.9,0.4-1.8,0.7-2.8,0.8c1-0.6,1.8-1.6,2.2-2.7c-1,0.6-2,1-3.1,1.2c-0.9-1-2.2-1.6-3.6-1.6 c-2.7,0-4.9,2.2-4.9,4.9c0,0.4,0,0.8,0.1,1.1C7.7,8.1,4.1,6.1,1.7,3.1C1.2,3.9,1,4.7,1,5.6c0,1.7,0.9,3.2,2.2,4.1 C2.4,9.7,1.6,9.5,1,9.1c0,0,0,0,0,0.1c0,2.4,1.7,4.4,3.9,4.8c-0.4,0.1-0.8,0.2-1.3,0.2c-0.3,0-0.6,0-0.9-0.1c0.6,2,2.4,3.4,4.6,3.4 c-1.7,1.3-3.8,2.1-6.1,2.1c-0.4,0-0.8,0-1.2-0.1c2.2,1.4,4.8,2.2,7.5,2.2c9.1,0,14-7.5,14-14c0-0.2,0-0.4,0-0.6 C22.5,6.4,23.3,5.5,24,4.6z" />
    //             </svg>
    //           </a>
    //           <a
    //             href="/"
    //             className="text-white  transition-colors duration-300 hover:text-deep-purple-accent-400"
    //           >
    //             <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
    //               <path d="M22,0H2C0.895,0,0,0.895,0,2v20c0,1.105,0.895,2,2,2h11v-9h-3v-4h3V8.413c0-3.1,1.893-4.788,4.659-4.788 c1.325,0,2.463,0.099,2.795,0.143v3.24l-1.918,0.001c-1.504,0-1.795,0.715-1.795,1.763V11h4.44l-1,4h-3.44v9H22c1.105,0,2-0.895,2-2 V2C24,0.895,23.105,0,22,0z" />
    //             </svg>
    //           </a>
    //         </div>
    //       </div>
    //     </div>
    //     <div>
    //       <div className="relative pb-56 mb-4 rounded shadow lg:pb-64">
    //       <img
    //         width="200px"
    //         height="50px"
    //         src={Raisa}
    //         alt="logo"
    //       />
    //       </div>
    //       <div className="flex flex-col sm:text-center">
    //         <p className="text-lg text-white font-bold">Raisa</p>
    //         <p className="mb-5 text-s text-white ">Software Engineer</p>
    //         <div className="flex items-center space-x-3 sm:justify-center">
    //           <a
    //             href="/"
    //             className="text-white  transition-colors duration-300 hover:text-deep-purple-accent-400"
    //           >
    //             <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
    //               <path d="M24,4.6c-0.9,0.4-1.8,0.7-2.8,0.8c1-0.6,1.8-1.6,2.2-2.7c-1,0.6-2,1-3.1,1.2c-0.9-1-2.2-1.6-3.6-1.6 c-2.7,0-4.9,2.2-4.9,4.9c0,0.4,0,0.8,0.1,1.1C7.7,8.1,4.1,6.1,1.7,3.1C1.2,3.9,1,4.7,1,5.6c0,1.7,0.9,3.2,2.2,4.1 C2.4,9.7,1.6,9.5,1,9.1c0,0,0,0,0,0.1c0,2.4,1.7,4.4,3.9,4.8c-0.4,0.1-0.8,0.2-1.3,0.2c-0.3,0-0.6,0-0.9-0.1c0.6,2,2.4,3.4,4.6,3.4 c-1.7,1.3-3.8,2.1-6.1,2.1c-0.4,0-0.8,0-1.2-0.1c2.2,1.4,4.8,2.2,7.5,2.2c9.1,0,14-7.5,14-14c0-0.2,0-0.4,0-0.6 C22.5,6.4,23.3,5.5,24,4.6z" />
    //             </svg>
    //           </a>
    //           <a
    //             href="/"
    //             className="text-white  transition-colors duration-300 hover:text-deep-purple-accent-400"
    //           >
    //             <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
    //               <path d="M22,0H2C0.895,0,0,0.895,0,2v20c0,1.105,0.895,2,2,2h11v-9h-3v-4h3V8.413c0-3.1,1.893-4.788,4.659-4.788 c1.325,0,2.463,0.099,2.795,0.143v3.24l-1.918,0.001c-1.504,0-1.795,0.715-1.795,1.763V11h4.44l-1,4h-3.44v9H22c1.105,0,2-0.895,2-2 V2C24,0.895,23.105,0,22,0z" />
    //             </svg>
    //           </a>
    //         </div>
    //       </div>
    //     </div>
    //     <div>
    //       <div className="relative pb-56 mb-4 rounded shadow lg:pb-64">
    //       <img
    //         width="200px"
    //         height="50px"
    //         src={YooJin}
    //         alt="logo"
    //       />
    //       </div>
    //       <div className="flex flex-col sm:text-center">
    //         <p className="text-lg text-white font-bold">YooJin</p>
    //         <p className="mb-5 text-s text-white ">Software Engineer</p>
    //         <div className="flex items-center space-x-3 sm:justify-center">
    //           <a
    //             href="/"
    //             className="text-white transition-colors duration-300 hover:text-deep-purple-accent-400"
    //           >
    //             <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
    //               <path d="M24,4.6c-0.9,0.4-1.8,0.7-2.8,0.8c1-0.6,1.8-1.6,2.2-2.7c-1,0.6-2,1-3.1,1.2c-0.9-1-2.2-1.6-3.6-1.6 c-2.7,0-4.9,2.2-4.9,4.9c0,0.4,0,0.8,0.1,1.1C7.7,8.1,4.1,6.1,1.7,3.1C1.2,3.9,1,4.7,1,5.6c0,1.7,0.9,3.2,2.2,4.1 C2.4,9.7,1.6,9.5,1,9.1c0,0,0,0,0,0.1c0,2.4,1.7,4.4,3.9,4.8c-0.4,0.1-0.8,0.2-1.3,0.2c-0.3,0-0.6,0-0.9-0.1c0.6,2,2.4,3.4,4.6,3.4 c-1.7,1.3-3.8,2.1-6.1,2.1c-0.4,0-0.8,0-1.2-0.1c2.2,1.4,4.8,2.2,7.5,2.2c9.1,0,14-7.5,14-14c0-0.2,0-0.4,0-0.6 C22.5,6.4,23.3,5.5,24,4.6z" />
    //             </svg>
    //           </a>
    //           <a
    //             href="/"
    //             className="text-white  transition-colors duration-300 hover:text-deep-purple-accent-400"
    //           >
    //             <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
    //               <path d="M22,0H2C0.895,0,0,0.895,0,2v20c0,1.105,0.895,2,2,2h11v-9h-3v-4h3V8.413c0-3.1,1.893-4.788,4.659-4.788 c1.325,0,2.463,0.099,2.795,0.143v3.24l-1.918,0.001c-1.504,0-1.795,0.715-1.795,1.763V11h4.44l-1,4h-3.44v9H22c1.105,0,2-0.895,2-2 V2C24,0.895,23.105,0,22,0z" />
    //             </svg>
    //           </a>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div id="Team" class=" bg-[#c4fbec] w-full py-[1rem] px-10 shadow-xl text-white">
      <h2 class="mb-4 font-sans text-3xl font-bold tracking-tight text-black sm:text-4xl sm:leading-none text-center py-5">Meet The Team</h2>
      <div class="max-w-[1000px] mx-auto grid md:grid-cols-4 gap-5">
        <div class=" w-80% shadow-xl flex flex-col p-4 my-4 rounded-lg bg-white hover:scale-105 duration-300">
          {/* <img class=" mx-auto mt-[-3rem] h-40 w-40 rounded-full" src="https://www.rtconnect.org/d1a1f7d32de1eb0c072c07f4ec866121.png" alt="/"> */}
            <p class="text-center text-4xl font-bold"></p>
            <div class="text-center font-medium">
              <p class="py-2 border-b mx-8 mt-8 text-black">Anthony King</p>
              <p class="py-2 border-b mx-8 text-black">Software Engineer</p>
              <div class="flex gap-3 ml-3 py-1 border-b mt-2 flex items-center justify-center">
                <a target="_blank" href="https://www.linkedin.com/in/aking97/">
                  {/* <img src="https://www.rtconnect.org/85f9ae6c39ea221b41b71222339deb98.svg" alt="LinkedIn Icon"> */}
                </a>
                <a target="_blank" href="https://github.com/thecapedcrusader">
                  {/* <img src="https://www.rtconnect.org/6ad7d0caba766bd9dc8acc2912da07e4.svg" alt="GitHub Icon"> */}
                </a>
              </div>
            </div>
          </div>
          <div class="w-full shadow-xl flex flex-col p-4 my-4 rounded-lg bg-white hover:scale-105 duration-300">
            {/* <img class=" mx-auto mt-[-3rem] h-40 rounded-full" src="https://www.rtconnect.org/fb7e58c858f50aaceb641ba73cba4a3a.png" alt="/"> */}
              <p class="text-center text-4xl font-bold"></p>
              <div class="text-center font-medium">
                <p class="py-2 border-b mx-8 mt-8 text-black">Louis Disen</p>
                <p class="py-2 border-b mx-8 text-black">Software Engineer</p>
                <div class="flex gap-3 ml-3 py-1 border-b mt-2 flex items-center justify-center">
                  <a target="_blank" href="https://www.linkedin.com/in/louis-disen/">
                    {/* <img src="https://www.rtconnect.org/85f9ae6c39ea221b41b71222339deb98.svg" alt="LinkedIn Icon"> */}
                  </a>
                  <a target="_blank" href="https://github.com/LouisDisen">
                    {/* <img src="https://www.rtconnect.org/6ad7d0caba766bd9dc8acc2912da07e4.svg" alt="GitHub Icon"> */}
                  </a>
                </div>
              </div>
            </div>
            <div class="w-full shadow-xl flex flex-col p-4 my-4 rounded-lg bg-white hover:scale-105 duration-300">
              {/* <img class=" mx-auto mt-[-3rem] h-40 rounded-full" src="https://www.rtconnect.org/19014a6c9c3f830b09afe65e438c05a5.png" alt="/"> */}
                <p class="text-center text-4xl font-bold"></p>
                <div class="text-center font-medium">
                  <p class="py-2 border-b mx-8 mt-8 text-black">Raisa Iftekher</p>
                  <p class="py-2 border-b mx-8 text-black">Software Engineer</p>
                  <div class="flex gap-3 ml-3 py-1 border-b mt-2 flex items-center justify-center">
                    <a target="_blank" href="https://www.linkedin.com/in/fraisa/">
                      {/* <img src="https://www.rtconnect.org/85f9ae6c39ea221b41b71222339deb98.svg" alt="LinkedIn Icon"> */}
                    </a>
                    <a target="_blank" href="https://github.com/fraisai">
                      {/* <img src="https://www.rtconnect.org/6ad7d0caba766bd9dc8acc2912da07e4.svg" alt="GitHub Icon"> */}
                    </a>
                  </div>
                </div>
              </div>
              <div class="w-full shadow-xl flex flex-col p-4 my-4 rounded-lg bg-white hover:scale-105 duration-300">
                {/* <img class=" mx-auto mt-[-3rem] h-40 rounded-full" src="https://www.rtconnect.org/1143019c9302a5395234af1bb93cdbf9.png" alt="/"> */}
                  <p class="text-center text-4xl font-bold"></p>
                  <div class="text-center font-medium">
                    <p class="py-2 border-b mx-8 mt-8 text-black">YooJin Chang</p>
                    <p class="py-2 border-b mx-8 text-black">Software Engineer</p>
                    <div class="flex gap-3 ml-3 py-1 border-b mx-8 mt-2 flex items-center justify-center">
                    <a target="_blank" href="https://www.linkedin.com/in/yoojin-chang-32a75892/">
                      {/* <img src="https://www.rtconnect.org/85f9ae6c39ea221b41b71222339deb98.svg" alt="LinkedIn Icon"> */}
                    </a>
                    <a target="_blank" href="https://github.com/ychang49265">
                      {/* <img src="https://www.rtconnect.org/6ad7d0caba766bd9dc8acc2912da07e4.svg" alt="GitHub Icon"> */}
                    </a>
                  </div>
                </div>
              </div>
            </div>
    </div>
  );
};

export default Team;
