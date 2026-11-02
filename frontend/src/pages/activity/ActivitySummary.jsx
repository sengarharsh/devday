import { useMemo } from "react";

const formatMinutes = (minutes) => {
  if (!minutes && minutes !== 0) return "0 mins";
  return `${minutes} mins`;
};

const ActivitySummary = ({ activities = [] }) => {
  const { totalMinutes, dsaMinutes, mostActiveCategory } = useMemo(() => {
    let total = 0;
    let dsa = 0;
    const categoryTotals = {};

    activities.forEach((act) => {
      const mins = act.duration ?? act.durationMinutes ?? 0;
      total += mins;
      if (act.type?.toUpperCase() === "DSA") {
        dsa += mins;
      }
      if (act.type) {
        categoryTotals[act.type] = (categoryTotals[act.type] || 0) + mins;
      }
    });

    let topCategory = "—";
    let maxMins = 0;
    Object.entries(categoryTotals).forEach(([cat, mins]) => {
      if (mins > maxMins) {
        maxMins = mins;
        topCategory = cat;
      }
    });

    return {
      totalMinutes: total,
      dsaMinutes: dsa,
      mostActiveCategory: topCategory,
    };
  }, [activities]);

  const cards = [
    {
      id: "total-time",
      title: "Total Learning Time",
      value: formatMinutes(totalMinutes),
      color: "primary",
    },
    {
      id: "activities-count",
      title: "Activities Logged",
      value: activities.length,
      color: "success",
    },
    {
      id: "dsa-time",
      title: "DSA Time",
      value: formatMinutes(dsaMinutes),
      color: "info",
    },
    {
      id: "top-category",
      title: "Most Active Category",
      value: mostActiveCategory,
      color: "warning text-dark",
    },
  ];

  return (
    <div className="row g-3 mb-4">
      {cards.map((card) => (
        <div key={card.id} className="col-12 col-sm-6 col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h6 className="card-subtitle text-secondary mb-2 small text-uppercase fw-semibold">
                {card.title}
              </h6>
              <h4 className={`card-title fw-bold mb-0 text-${card.color}`}>
                {card.value}
              </h4>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivitySummary;
