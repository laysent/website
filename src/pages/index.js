import React from 'react'
import { Link } from 'gatsby'
import { rhythm } from '../utils/typography';
import SEO from '../components/seo';
import './homepage.css';

class Homepage extends React.Component {
  render() {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
        }}
      >
        <SEO lang="en" location={this.props.location} title="Homepage" />
        <nav className="menu">
          <ul>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/til">Today I Learn</Link></li>
          </ul>
        </nav>
        <main
          style={{
            width: '100%',
            height: '61.8vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={() => this.setState({ show: true })}
        >
          <article style={{ minWidth: rhythm(10), position: 'relative' }}>
            <h1
              className="title"
              style={{ lineHeight: rhythm(2.4) }}
              lang="en"
            >
              <span>LaySent</span>
            </h1>
            <section>
              <ul>
                <li>Front end engineer without aesthetic sense.</li>
                <li>Studied German and Math.</li>
                <li>Love Reading and A.C.G.</li>
                <li>Driven by curiosity.</li>
              </ul>
            </section>
          </article>
        </main>
        <footer
          style={{
            width: '100vw',
            height: '38.2vh',
            backgroundColor: '#000',
            color: '#fff',
          }}
        >
          <nav className="footer">
            <div>
              <a href="https://github.com/laysent" rel="noopener noreferrer" target="_blank">
                <svg viewBox="64 64 896 896" focusable="false">
                  <path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0 1 38.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z" />
                </svg>
              </a>
              <a href="https://book.douban.com/people/laysent/collect" rel="noopener noreferrer" target="_blank">
                <svg viewBox="0 0 32 28">
                  <path d="M9.731,18.328 C11.034,20.105 12.209,22.341 13.238,24.849 L19.561,24.849 C20.791,22.914 21.741,20.676 22.669,18.328 L26.237,19.527 C25.304,21.507 24.169,23.344 23.102,24.849 L31.955,24.849 L32.000,28.000 L-0.000,28.000 L-0.000,25.000 L9.697,24.849 C8.860,23.229 7.803,21.397 6.449,19.527 L9.731,18.328 ZM1.000,-0.000 L31.000,-0.000 L31.000,3.000 L1.000,3.000 L1.000,-0.000 ZM4.132,5.882 L28.000,6.000 L28.000,18.000 L4.000,18.000 L4.132,5.882 ZM25.000,15.000 L25.126,8.838 L7.000,9.000 L7.000,15.000 L25.000,15.000 Z" />
                </svg>
              </a>
            </div>
            <div>
              <a href="https://weibo.com/laysent" rel="noopener noreferrer" target="_blank">
                <svg viewBox="64 64 896 896" focusable="false">
                  <path d="M457.3 543c-68.1-17.7-145 16.2-174.6 76.2-30.1 61.2-1 129.1 67.8 151.3 71.2 23 155.2-12.2 184.4-78.3 28.7-64.6-7.2-131-77.6-149.2zm-52 156.2c-13.8 22.1-43.5 31.7-65.8 21.6-22-10-28.5-35.7-14.6-57.2 13.7-21.4 42.3-31 64.4-21.7 22.4 9.5 29.6 35 16 57.3zm45.5-58.5c-5 8.6-16.1 12.7-24.7 9.1-8.5-3.5-11.2-13.1-6.4-21.5 5-8.4 15.6-12.4 24.1-9.1 8.7 3.2 11.8 12.9 7 21.5zm334.5-197.2c15 4.8 31-3.4 35.9-18.3 11.8-36.6 4.4-78.4-23.2-109a111.39 111.39 0 0 0-106-34.3 28.45 28.45 0 0 0-21.9 33.8 28.39 28.39 0 0 0 33.8 21.8c18.4-3.9 38.3 1.8 51.9 16.7a54.2 54.2 0 0 1 11.3 53.3 28.45 28.45 0 0 0 18.2 36zm99.8-206c-56.7-62.9-140.4-86.9-217.7-70.5a32.98 32.98 0 0 0-25.4 39.3 33.12 33.12 0 0 0 39.3 25.5c55-11.7 114.4 5.4 154.8 50.1 40.3 44.7 51.2 105.7 34 159.1-5.6 17.4 3.9 36 21.3 41.7 17.4 5.6 36-3.9 41.6-21.2v-.1c24.1-75.4 8.9-161.1-47.9-223.9zM729 499c-12.2-3.6-20.5-6.1-14.1-22.1 13.8-34.7 15.2-64.7.3-86-28-40.1-104.8-37.9-192.8-1.1 0 0-27.6 12.1-20.6-9.8 13.5-43.5 11.5-79.9-9.6-101-47.7-47.8-174.6 1.8-283.5 110.6C127.3 471.1 80 557.5 80 632.2 80 775.1 263.2 862 442.5 862c235 0 391.3-136.5 391.3-245 0-65.5-55.2-102.6-104.8-118zM443 810.8c-143 14.1-266.5-50.5-275.8-144.5-9.3-93.9 99.2-181.5 242.2-195.6 143-14.2 266.5 50.5 275.8 144.4C694.4 709 586 796.6 443 810.8z" />
                </svg>
              </a>
              <a href="https://twitter.com/laysent" rel="noopener noreferrer" target="_blank">
                <svg viewBox="64 64 896 896" focusable="false">
                  <path d="M928 254.3c-30.6 13.2-63.9 22.7-98.2 26.4a170.1 170.1 0 0 0 75-94 336.64 336.64 0 0 1-108.2 41.2A170.1 170.1 0 0 0 672 174c-94.5 0-170.5 76.6-170.5 170.6 0 13.2 1.6 26.4 4.2 39.1-141.5-7.4-267.7-75-351.6-178.5a169.32 169.32 0 0 0-23.2 86.1c0 59.2 30.1 111.4 76 142.1a172 172 0 0 1-77.1-21.7v2.1c0 82.9 58.6 151.6 136.7 167.4a180.6 180.6 0 0 1-44.9 5.8c-11.1 0-21.6-1.1-32.2-2.6C211 652 273.9 701.1 348.8 702.7c-58.6 45.9-132 72.9-211.7 72.9-14.3 0-27.5-.5-41.2-2.1C171.5 822 261.2 850 357.8 850 671.4 850 843 590.2 843 364.7c0-7.4 0-14.8-.5-22.2 33.2-24.3 62.3-54.4 85.5-88.2z" />
                </svg>
              </a>
            </div>
          </nav>
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'rgba(255, 255, 255, 0.3)',
            }}
          >
            <span>© </span>
            <span itemProp="copyrightYear">{new Date().getFullYear()}</span>
            <span> </span>
            <span itemProp="author" itemScope itemType="http://schema.org/Person">
              <span itemProp="name">LaySent</span>
            </span>
          </div>
        </footer>
      </div>
    );
  }
}

export default Homepage
