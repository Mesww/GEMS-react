import gemlogo from '../../assets/Screenshot_2567-07-10_at_12.04.25-removebg.png';
import "./style.sass";
import { useState } from 'react';

const Navbar = () => {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleLogoClick = () => {
        setIsAnimating(prevState => !prevState);
    };

    return (
        <nav className={`navbar fixed bottom-5 left-0 right-0 z-50 rounded-full ${isAnimating ? 'navbar-close' : ''}`}>
            <div className="px-4 flex items-center h-14 navbar-wrapper">
                <div className={`content ${isAnimating ? 'center-content' : ''}`}>1</div>
                <img src={gemlogo} alt="logo" className={`mx-auto logo w-20 ${isAnimating ? '' : 'spin'}`} onClick={handleLogoClick} />
                <div className={`content ${isAnimating ? 'center-content' : ''}`}>1</div>
            </div>
        </nav>
    );
}

export default Navbar;