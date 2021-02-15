import React from 'react';

export const ColumnChart = ({ data, max }) => {
  return (
    <div className="column-chart">
      <div className="column-chart__wrapper">
        {
          data.map((column, index) => {
            return index % 2 === 0 ? (
              <div className="column-chart__wrapper--column">
                <div className="column-chart__wrapper--column--holder orange-column">
                  <div className="column-chart__wrapper--column--bar" style={{
                    height: `${(column.number / max) * 100}%`
                  }}>
                    {
                      column.number !== 0 && <p>{column.number.toFixed(2)}km</p>
                    }
                  </div>
                </div>
                <span>
                  {column.month}
                </span>
              </div>
            ) : (
              <div className="column-chart__wrapper--column">
                <div className="column-chart__wrapper--column--holder grey-column">
                  <div className="column-chart__wrapper--column--bar" style={{
                    height: `${(column.number / max) * 100}%`
                  }}>
                    {
                      column.number !== 0 && <p>{column.number}km</p>
                    }
                  </div>
                </div>
                <span>
                  {column.month}
                </span>
              </div>
            )
          })
        }
      </div>
    </div>
  );
};
