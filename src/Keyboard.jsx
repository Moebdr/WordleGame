import React from 'react'

const Keyboard = ({status,ind,cha}) => {
    const keyboard = ["q","w","e","r","t","y","u","i","o","p",
    "a","s","d","f","g","h","j","k","l",
    "z","x","c","v","b","n","m"].map(char => char.toUpperCase());
    const handleClick = (e) => {
        const key = e.target.value;
      
      }
  return (
    <div className='grid grid-cols-11 justify-center gap-1 mt-4 w-130 justify-items-center   mx-auto'>
        {
            keyboard.map((char,index) => (
             <button onClick={handleClick} value={char} key={index} className={`${status[cha][ind]}bg-gray-300 m-1 p-2  w-10 h-10 rounded-md text-black font-bold`}>{char}</button>
            ))

        }
    </div>
  )
}
  


export default Keyboard