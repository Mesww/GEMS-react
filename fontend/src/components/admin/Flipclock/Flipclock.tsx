import React from 'react';
import './style.sass';
interface AnimatedCardProps {
  animation: string;
  digit: string | number;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ animation, digit }) => {
  return (
    <div className={`flipCard ${animation}`}>
      <span>{digit}</span>
    </div>
  );
};

interface StaticCardProps {
  position: string;
  digit: string | number;
}

const StaticCard: React.FC<StaticCardProps> = ({ position, digit }) => {
  return (
    <div className={position}>
      <span>{digit}</span>
    </div>
  );
};

interface FlipUnitContainerProps {
  digit: number;
  shuffle: boolean;
  unit: string;
}

const FlipUnitContainer: React.FC<FlipUnitContainerProps> = ({ digit, shuffle, unit }) => {
  let currentDigit = digit;
  let previousDigit = digit - 1;

  if (unit !== 'hours') {
    previousDigit = previousDigit === -1 ? 59 : previousDigit;
  } else {
    previousDigit = previousDigit === -1 ? 23 : previousDigit;
  }
  const formatDigit = (num: number): string => num < 10 ? `0${num}` : `${num}`;
  const currentDigitStr = formatDigit(currentDigit);
  const previousDigitStr = formatDigit(previousDigit);

 const digit1 = shuffle ? previousDigitStr : currentDigitStr;
  const digit2 = !shuffle ? previousDigitStr : currentDigitStr;

  const animation1 = shuffle ? 'fold' : 'unfold';
  const animation2 = !shuffle ? 'fold' : 'unfold';

  return (
    <div className={'flipUnitContainer'}>
      <StaticCard position={'upperCard'} digit={currentDigitStr} />
      <StaticCard position={'lowerCard'} digit={previousDigitStr} />
      <AnimatedCard digit={digit1} animation={animation1} />
      <AnimatedCard digit={digit2} animation={animation2} />
    </div>
  );
};

interface FlipClockState {
  hours: number;
  hoursShuffle: boolean;
  minutes: number;
  minutesShuffle: boolean;
  seconds: number;
  secondsShuffle: boolean;
}

class FlipClock extends React.Component<{}, FlipClockState> {
  private timerID: number | null = null;

  constructor(props: {}) {
    super(props);
    this.state = {
      hours: 0,
      hoursShuffle: true,
      minutes: 0,
      minutesShuffle: true,
      seconds: 0,
      secondsShuffle: true
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.updateTime(),
      50
    );
  }

  componentWillUnmount() {
    if (this.timerID) clearInterval(this.timerID);
  }

  updateTime() {
    const time = new Date();
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    if (hours !== this.state.hours) {
      const hoursShuffle = !this.state.hoursShuffle;
      this.setState({
        hours,
        hoursShuffle
      });
    }

    if (minutes !== this.state.minutes) {
      const minutesShuffle = !this.state.minutesShuffle;
      this.setState({
        minutes,
        minutesShuffle
      });
    }

    if (seconds !== this.state.seconds) {
      const secondsShuffle = !this.state.secondsShuffle;
      this.setState({
        seconds,
        secondsShuffle
      });
    }
  }

  render() {
    const {
      hours,
      minutes,
      seconds,
      hoursShuffle,
      minutesShuffle,
      secondsShuffle
    } = this.state;

    return (
      <div className={'flipClock'}>
        <FlipUnitContainer
          unit={'hours'}
          digit={hours}
          shuffle={hoursShuffle}
        />
        <FlipUnitContainer
          unit={'minutes'}
          digit={minutes}
          shuffle={minutesShuffle}
        />
        <FlipUnitContainer
          unit={'seconds'}
          digit={seconds}
          shuffle={secondsShuffle}
        />
      </div>
    );
  }
}

export default FlipClock;