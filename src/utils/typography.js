import Typography from 'typography'
import Wordpress2016 from 'typography-theme-wordpress-2016'

Wordpress2016.bodyFontFamily = [
  'Rubik',
  '-apple-system',
  'BlinkMacSystemFont',
  'PingFang SC',
  'Segoe UI',
  'Roboto',
  'Oxygen',
  'Ubuntu',
  'Cantarell',
  'Fira Sans',
  'Droid Sans',
  'Helvetica Neue',
  'Helvetica',
  'Arial',
  'Hiragino Sans GB',
  'Microsoft Yahei',
  'WenQuanYi Micro Hei',
  'sans-serif',
];

Wordpress2016.headerFontFamily = Wordpress2016.bodyFontFamily;
Wordpress2016.googleFonts = [{ name: 'Rubik', styles: [300, 400, 500] }];

Wordpress2016.overrideThemeStyles = () => {
  return {
    'a.gatsby-resp-image-link': {
      boxShadow: `none`,
    },
    h1: {
      fontFamily: Wordpress2016.bodyFontFamily.map(JSON.stringify).join(','),
    },
    '@media (prefers-color-scheme: dark)': {
      body: {
        color: '#fff',
        backgroundColor: '#333',
      },
      blockquote: {
        borderLeftColor: 'hsla(0,0%,100%,0.9)',
        color: 'hsla(0,0%,100%,0.59)',
      },
      hr: {
        backgroundColor: 'hsla(0,0%,100%,0.2)',
      }
    },
  };
}

const typography = new Typography(Wordpress2016)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
