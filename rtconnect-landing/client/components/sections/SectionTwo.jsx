import React from 'react'

const SectionTwo = () => {
  return (
    <>
    <div class="pl-2px w-screen bg-[#c4fbec] text-whiteshadow-xl">
      <div class="container mx-auto px-4 py-10">
        <div class="flex flex-wrap">
          <div class="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg hover:scale-105 duration-300 ">
              <div class="px-4 py-5 flex-auto">
                <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                  <i class="fas fa-award"></i>
                </div>
                <h6 class="text-xl font-semibold">Low Latency Data Transfer 
                 <br></br>
                </h6>
                <p class="mt-2 mb-4 text-gray-600">Leverages the low latency data transfer of Websockets in order to share user media and to establish peer connections. Also gives the option of establishing a more secure connection by utilizing an https server and websocket secure (wss) connection.</p>
              </div>
            </div>
          </div>
            <div class="w-full md:w-4/12 px-4 text-center">
              <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg hover:scale-105 duration-300 ">
                <div class="px-4 py-5 flex-auto">
                  <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    <i class="fas fa-retweet"></i>
                  </div>
                  <h6 class="text-xl font-semibold">Simplifies the Process of Setting up WebRTC’s Peer Connection Logic</h6>
                  <p class="mt-2 mb-4 text-gray-600">RTConnect implements WebRTC’s peer connection logic and a Signaling Channel all within the functional scope of a React component for the frontend and an importable module for the backend.</p>
                </div>
              </div>
            </div>
            <div class="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
              <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg hover:scale-105 duration-300 ">
                <div class="px-4 py-5 flex-auto">
                  <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                    </svg>
                    <i class="fas fa-award"></i>
                  </div>
                  <h6 class="text-xl font-semibold">Establishing a More Secure Connection</h6>
                  <p class="mt-2 mb-4 text-gray-600">Gives developers the option of establishing a more secure connection by utilizing an https server and websocket secure (wss) connection instead of a http server and websocket connection.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        {/* <div className="bg-black flex flex-col px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20"> */}
        {/* <div
  class="h-[700px] md:h-[600px] w-screen bg-black text-white shadow-xl"> */}
{/* >  <div class="flex flex-col md:flex-row h-full m-12 md:m-24 md:gap-10"> */}
    {/* <div class="w-full md:w-1/2 h-full flex flex-col justify-center"> */}
          {/* <div className="max-w-screen-sm sm:text-center sm:mx-auto">
            <a
              href="/"
              aria-label="View"
              className="inline-block mb-5 rounded-full sm:mx-auto"
            >
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-50">
                <svg
                  className="w-12 h-12 text-deep-purple-accent-400"
                  stroke="currentColor"
                  viewBox="0 0 52 52"
                >
                  <polygon
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    points="29 13 14 29 25 29 23 39 38 23 27 23"
                  />
                </svg>
              </div>
            </a>
            <h2 className="mb-4 font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl sm:leading-none">
              RTConnect abstracts away and simplifies WebRTC for developers
            </h2>
            <p className="text-base text-white md:text-lg sm:px-4">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque rem aperiam, eaque ipsa quae.
            </p>
            <hr className="w-full my-8 border-gray-300" />
          </div>


          
        </div>
         </div> */}
        </>
      );
      
}

export default SectionTwo