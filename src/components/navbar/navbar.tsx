import gemlogo from '../../assets/Screenshot_2567-07-10_at_12.04.25-removebg.png';
import "./style.sass";
import { useState } from 'react';

// export const [activeContent, setActiveContent] = useState(null);
const Navbar: React.FC<{
    activeContent: any;
    setActiveContent: React.Dispatch<React.SetStateAction<null>>;
}> = ({ activeContent, setActiveContent }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    
    const handleLogoClick = () => {
        setIsAnimating(prevState => !prevState);
    };
    
    const handleContentClick = (contentId: any) => {
        setActiveContent(prevContentId => prevContentId === contentId ? null : contentId);
    };
    

    return (
        <nav className={`navbar fixed bottom-5 left-0 rounded-full right-0 z-50 ${isAnimating ? '' : 'navbar-close'}`}>
            <div className="px-10 flex items-center h-14 navbar-wrapper">
                <div className={`content ${activeContent === 'content1' ? 'selected' : ''}`}  onClick={() => handleContentClick('content1')}>1</div>
                <div className={`content ${activeContent === 'content2' ? 'selected' : ''}`}  onClick={() => handleContentClick('content2')}>1</div>
                <img src={gemlogo} alt="logo" className={` logo w-20 ${isAnimating ? 'spin' : ''}`} onClick={handleLogoClick} />
                <div className={`content  ${activeContent === 'route1' ? 'selected' : ''} `}  onClick={() => handleContentClick('route1')}>1</div>
                <div className={`content  ${activeContent === 'route2' ? 'selected' : ''}`}  onClick={() => handleContentClick('route2')}>2</div>
            </div>
        </nav>
    );
}

export default Navbar;