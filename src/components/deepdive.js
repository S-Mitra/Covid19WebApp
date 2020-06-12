import AgeChart from './Charts/agechart';
import AllStatesChart from './Charts/allstates';
import DailyConfirmedChart from './Charts/dailyconfirmedchart';
import GenderChart from './Charts/genderchart';
import GrowthTrendChart from './Charts/growthtrendchart';
import NationalityChart from './Charts/nationalitychart';
import TotalConfirmedChart from './Charts/totalconfirmedchart';

import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {Helmet} from 'react-helmet';

function DeepDive() {
  const [fetched, setFetched] = useState(false);
  const [timeseries, setTimeseries] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [statesTimeSeries, setStatesTimeSeries] = useState([]);

  useEffect(() => {
    if (fetched === false) {
      getStates();
    }
  }, [fetched]);

  let slideIndex = 1;
  showSlides(slideIndex);

  // Next/previous controls
  function plusSlides(n) {
    showSlides(slideIndex += n);
  }

  // Thumbnail image controls
  function currentSlide(n) {
    showSlides(slideIndex = n);
  }

  function showSlides(n) {
    let i;
    // const slides = document.getElementById('mySlides')
    let slides = document.getElementsByClassName('mySlides');
    let dots = document.getElementsByClassName('dot');
    if (slides.length != 0 && dots.length != 0) {
      if (n > slides.length) {
        slideIndex = 1;
      }
      if (n < 1) {
        slideIndex = slides.length;
      }
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
      }
      for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(' active', '');
      }
      slides[slideIndex - 1].style.display = 'block';
      dots[slideIndex - 1].className += ' active';
    }
  }

  const getStates = async () => {
    try {
      const [
        response,
        rawDataResponse,
        stateDailyResponse,
      ] = await Promise.all([
        axios.get('https://api.covid19india.org/data.json'),
        axios.get('https://api.covid19india.org/raw_data.json'),
        axios.get('https://api.covid19india.org/states_daily.json'),
      ]);
      setTimeseries(response.data.cases_time_series);
      setStatesTimeSeries(stateDailyResponse.data.states_daily);
      setRawData(rawDataResponse.data.raw_data);
      setFetched(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="cards-container">
      <Helmet>
        <title>Deep Dive - covid19india.org</title>
        <meta name="title" content="Deep Dive - covid19india.org" />
      </Helmet>

      <div className="slideshow-container">
        <div className="mySlides fade">
          <TotalConfirmedChart title="Total Cases" timeseries={timeseries} />
        </div>

        <div className="mySlides fade">
          <DailyConfirmedChart title="Daily Cases" timeseries={timeseries} />
        </div>

        <div className="mySlides fade card-big">
          <AllStatesChart
            title="Total Cases by State"
            data={statesTimeSeries}
          />
        </div>

        <div className="mySlides fade">
          <GrowthTrendChart
            title="States - Growth Trend"
            data={statesTimeSeries}
          />
        </div>

        <div className="mySlides fade">
          <GenderChart title="Patient Gender" data={rawData} />
        </div>

        <div className="mySlides fade">
          <AgeChart title="Patients by Age" data={rawData} />
        </div>

        <div className="mySlides fade">
          <NationalityChart title="Patients by  Nationality" data={rawData} />
        </div>
        {/* Next and previous buttons */}
        <a className="prev" onClick={() => plusSlides(-1)}>
          &#10094;
        </a>
        <a className="next" onClick={() => plusSlides(1)}>
          &#10095;
        </a>
      </div>
      <br />
      {/* The dots/circles  */}
      <div style={{textAlign: 'center'}}>
        <span className="dot" onClick={() => currentSlide(1)}></span>
        <span className="dot" onClick={() => currentSlide(2)}></span>
        <span className="dot" onClick={() => currentSlide(3)}></span>
        <span className="dot" onClick={() => currentSlide(4)}></span>
        <span className="dot" onClick={() => currentSlide(5)}></span>
        <span className="dot" onClick={() => currentSlide(6)}></span>
        <span className="dot" onClick={() => currentSlide(7)}></span>
      </div>
    </div>
  );
}

export default DeepDive;
