export interface settingModalinterface {
    setsettingIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    settingisVisible: boolean;
    setActiveContent: React.Dispatch<React.SetStateAction<string | null>>;
}