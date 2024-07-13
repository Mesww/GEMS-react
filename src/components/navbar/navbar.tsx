import { Link } from 'react-router-dom'; // If using React Router
import gemlogo from '../../assets/Screenshot_2567-07-10_at_12.04.25-removebg.png';
import "./style.sass";
const Navbar = () => {
  return (
    <nav className=" navbar  fixed bottom-5 left-0 right-0 z-50 rounded-full">
      <div className=" px-4 flex justify-between items-center h-14 ">
        {/* <Link className="text-white text-xl font-bold" to="/">Logo</Link> */}
        <div>1</div>
        <img src={gemlogo} alt="logo" className='   w-14 ' />
        <div>1</div>
      </div>
    </nav>
  );
}

export default Navbar;