import React, { useEffect } from "react";
import { settingModalinterface } from "../../interfaces/settingModal.interface";
import './style.sass';
import { useTranslation } from 'react-i18next';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import thailandicon from './thailand.svg';
import usaicon from './usa.svg';
import Swal from 'sweetalert2'
import  Cookies  from 'js-cookie';
import { useNavigate } from "react-router-dom";

const SettingModal: React.FC<settingModalinterface> = ({ setsettingIsVisible, settingisVisible,setActiveContent }) => {
    const { i18n } = useTranslation();
    const [language, setLanguage] = React.useState('English'); // Default language is English
    const navigate = useNavigate();
    
    const handleLanguageChange = (lang: string) => {
        setLanguage(lang === 'en' ? 'English' : 'ภาษาไทย'); // Update the language state based on the selected language
        i18n.changeLanguage(lang);
        // Save the selected language in localStorage
        localStorage.setItem('language', lang);
    };
    const {t} = useTranslation();

  const handleSignout = async () =>  {
    const { isConfirmed}= await  Swal.fire({
        title: t('navbar.logoutDialog.title'),
        text: t('navbar.logoutDialog.text'),
        icon: 'warning',
        confirmButtonText: t('navbar.logoutDialog.confirm'),
        confirmButtonColor: '#8b090c',
        showCancelButton: true,
        cancelButtonText: t('navbar.logoutDialog.cancel'),
        cancelButtonColor: '#e2b644',
        background: '#f9f4d4',
        reverseButtons: true,
        showClass: {
            popup: `
              animate__animated
              animate__fadeInUp
              animate__faster
            `
          },
          hideClass: {
            popup: `
              animate__animated
              animate__fadeOutDown
              animate__faster
            `
          }
      })
      if (isConfirmed) {
        // setCookies("token","")
        Cookies.remove("token");
        navigate('/',{replace:true});
        setActiveContent(null);
      }
  };
    // Load the saved language preference from localStorage when the component mounts
    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'en';
        handleLanguageChange(savedLanguage);
    }, []); // Empty array ensures this runs once on mount

    const handleSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            handleLanguageChange('en'); // Switch to English if the switch is checked
        } else {
            handleLanguageChange('th'); // Switch to Thai if the switch is unchecked
        }
    };

    const MaterialUISwitch = styled(Switch)(({ }) => ({
        width: 50,
        height: 28,
        padding: 7,
        '& .MuiSwitch-switchBase': {
            margin: 1,
            padding: 0,
            transform: 'translateX(6px)',
            '&.Mui-checked': {
                color: '#fff',
                transform: 'translateX(22px)',
                '& .MuiSwitch-thumb:before': {
                    backgroundImage: `url(${usaicon})`, // USA icon when English is selected
                },
                '& + .MuiSwitch-track': {
                    opacity: 1,
                    backgroundColor: '#aab4be',
                },
            },
        },
        '& .MuiSwitch-thumb': {
            backgroundColor: '#001e3c',
            width: 24,
            height: 24,
            '&::before': {
                content: "''",
                position: 'absolute',
                width: '100%',
                height: '100%',
                left: 0,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundImage: `url(${thailandicon})`, // Thai icon when Thai is selected
            },
        },
        '& .MuiSwitch-track': {
            opacity: 1,
            backgroundColor: '#aab4be',
            borderRadius: 20 / 2,
        },
    }));

    return (
        <div className={`fixed bottom-24 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${settingisVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"}`}>
            <div className="card flex justify-center ">
                <div className="flex flex-col items-center bg-white rounded-lg p-4">
                    <div className="flex justify-between w-full">
                        <div>
                            <button onClick={() => setsettingIsVisible(false)} className="material-icons">close</button>
                        </div>
                    </div>
                    <div className="option">
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <MaterialUISwitch
                                        // sx={{ m: 1 }}
                                        checked={language === 'English'} // Update checked state based on the language
                                        onChange={handleSwitch} // Call handleSwitch when toggled
                                    />
                                }
                                label={language} // Display current language
                            />
                        </FormGroup>
                    </div>
                    <div className="option">
                        <button onClick={handleSignout} className=" flex "> <div className="material-icons">logout</div>{t('navbar.logoutDialog.title')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingModal;
