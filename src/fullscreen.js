//import IconButton from '@material-ui/core/IconButton';
//import FullscreenIcon from '@material-ui/icons/Fullscreen';
//import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import * as React from 'react';
import { useFullscreen } from '@straw-hat/react-fullscreen';
import { useHotkeys } from 'react-hotkeys-hook';


export const FullscreenButton = () => {
  const { isFullscreen, toggleFullscreen } = useFullscreen(
    window.document.body
  );

  useHotkeys("f",toggleFullscreen)  

  return (
    <button onClick={toggleFullscreen}>Toggle</button>
  );


/*    
<IconButton color="inherit" onClick={toggleFullscreen}>
    {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
</IconButton>
*/

};