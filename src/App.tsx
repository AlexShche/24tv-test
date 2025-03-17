import { FC } from 'react';

import { Slider } from './components/Slider';
import { VideoPlayer } from './components/VideoPlayer';

// все данные берутся из конфига
import { slides, srcVideo, posterVideo } from './config';

const App: FC = () => {
  return (
    <div>
      <Slider slides={slides} />
      <VideoPlayer src={srcVideo} poster={posterVideo} />
    </div>
  );
};

export default App;
