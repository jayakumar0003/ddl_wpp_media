import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchAudiencesList, fetchRateCardList, submitPlan } from "../api/campaignsApi";

const SubmitPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const campaign = location.state?.campaign;

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Form states
  const [displayName, setDisplayName] = useState("");
  const [budget, setBudget] = useState("50000000");
  const [audienceIds, setAudienceIds] = useState([]);
  
  // Data options
  const [audienceOptions, setAudienceOptions] = useState([]);
  const [rateCards, setRateCards] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);

  // Handle lazy loading as you scroll down the table
  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      if (visibleCount < rateCards.length) {
        setVisibleCount((prev) => prev + 10);
      }
    }
  };

  useEffect(() => {
    // If we somehow got here without a campaign, redirect back
    if (!campaign) {
      navigate('/campaigns');
      return;
    }

    // Prepopulate known fields
    if (campaign.audience_ids && Array.isArray(campaign.audience_ids)) {
      setAudienceIds(campaign.audience_ids);
    }

    const loadData = async () => {
      try {
        const [audiencesRes, rateCardsRes] = await Promise.all([
          fetchAudiencesList(),
          fetchRateCardList("3e1a59bf-87c4-4821-994f-43820835e4cc")
        ]);
        
        setAudienceOptions(audiencesRes);
        setRateCards(rateCardsRes);
      } catch (error) {
        console.error("Failed to load initial data for create plan", error);
        setFormError("Failed to load required data from server.");
      } finally {
        setLoadingInitial(false);
      }
    };

    loadData();
  }, [campaign, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!displayName.trim()) {
      alert("Display Name is required.");
      return;
    }
    if (audienceIds.length === 0) {
      alert("Audience is required.");
      return;
    }
    if (!budget || isNaN(budget) || Number(budget) <= 0) {
      alert("Valid Budget is required.");
      return;
    }

    // Extrapolate creative duration from Campaign (default to 6 if not available)
    const creativeDuration = (campaign.creative_durations_seconds && campaign.creative_durations_seconds.length > 0)
      ? campaign.creative_durations_seconds[0] : 6;

    const formData = new FormData();
    formData.append("creative_duration", creativeDuration);
    formData.append("display_name", displayName.trim());
    formData.append("budget", budget);
    
    // The old AJAX code sent campaign_ids[] 
    formData.append("campaign_ids[]", campaign.id);

    // Backend specifically looks for request.form.get('audience_id')
    if (audienceIds.length > 0) {
      formData.append("audience_id", audienceIds[0]);
    }

    setIsSubmitting(true);
    try {
      await submitPlan(formData);
      alert("Plan submitted successfully!");
      navigate('/campaigns');
    } catch (error) {
      console.error("Submit failed:", error);
      
      // Inline Error mapping
      if (error.data?.details?.details?.[0]?.field_violations) {
          const violations = error.data.details.details[0].field_violations;
          const errorMessages = violations.map(v => v.description).join(" | ");
          setFormError(errorMessages || error.data?.message || "Validation failed.");
          alert(errorMessages || "Validation failed.");
      } else if (error.data?.message) {
          setFormError(error.data.message);
          alert(error.data.message);
      } else {
          setFormError("Failed to submit plan. Please try again.");
          alert("Failed to submit plan.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!campaign) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      {/* Loading Overlay */}
      {(loadingInitial || isSubmitting) && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
          <Loader2 className="w-10 h-10 text-dark-blue animate-spin" />
        </div>
      )}

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] p-6 md:p-8 relative">
        {/* Header */}
        <div className="bg-dark-blue rounded-lg p-3 mb-5 flex items-center gap-3 text-white shadow-sm">
          <button 
            onClick={() => navigate('/campaigns')}
            className="hover:text-gray-200 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-base md:text-lg font-semibold m-0">Submit Plan</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative text-sm mb-4">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{formError}</span>
            </div>
          )}

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Audience Multi-Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Audience
            </label>
            <div className="w-full border border-gray-300 rounded-lg bg-white relative">
              <div className="flex flex-wrap gap-2 p-2">
                 {audienceIds.map((id) => {
                    const matchedAudience = audienceOptions.find(a => a.audienceUUId === id);
                    const label = matchedAudience ? matchedAudience.name : id;
                    return (
                      <div key={id} className="flex items-center gap-1 bg-gray-100 border border-gray-200 text-gray-600 px-2 py-1 rounded text-xs truncate max-w-[90%]">
                        <span className="truncate">{label}</span>
                        <button
                          type="button"
                          onClick={() => setAudienceIds(prev => prev.filter(v => v !== id))}
                          className="text-gray-400 hover:text-red-500 focus:outline-none ml-1"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    );
                 })}
                 <select
                   className="flex-1 min-w-[200px] outline-none bg-transparent text-sm text-gray-700 border-none appearance-none"
                   value=""
                   onChange={(e) => {
                     const val = e.target.value;
                     if (val && !audienceIds.includes(val)) {
                       setAudienceIds(prev => [...prev, val]);
                     }
                   }}
                 >
                   <option value="" disabled hidden>
                     {audienceOptions.length === 0 ? "Loading audiences..." : "Select audience..."}
                   </option>
                   {audienceOptions.filter(a => !audienceIds.includes(a.audienceUUId)).map((audience) => (
                     <option key={audience.audienceUUId} value={audience.audienceUUId}>
                       {audience.name}
                     </option>
                   ))}
                 </select>
              </div>
            </div>
          </div>

          {/* Campaign Input (Disabled) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign
            </label>
            <input
              type="text"
              value={campaign.display_name}
              disabled
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Budget Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <hr className="my-8 border-gray-200" />

          {/* Plan Rates Table */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Plan Rates</h3>
              <div className="flex gap-2">
                <button type="button" className="text-sm font-medium bg-white text-gray-600 border border-gray-300 px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
                  <span className="text-blue-500">↓</span> Override Template
                </button>
                <button type="button" className="text-sm font-medium bg-white text-gray-600 border border-gray-300 px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
                  <span className="text-blue-500">↑</span> Override
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
              <div 
                className="overflow-x-auto max-h-[400px] overflow-y-auto relative"
                onScroll={handleScroll}
              >
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-bold bg-white w-1/4">Title Name</th>
                      <th scope="col" className="px-4 py-3 font-bold bg-white w-1/6">Custom Param 1</th>
                      <th scope="col" className="px-4 py-3 font-bold bg-white w-1/5">Custom Param 2</th>
                      <th scope="col" className="px-4 py-3 font-bold bg-white w-1/6">Rate Override Type</th>
                      <th scope="col" className="px-4 py-3 font-bold bg-white w-1/6">Rate Override</th>
                      <th scope="col" className="px-4 py-3 font-bold bg-white text-center w-[120px]">Rate Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rateCards.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                          {loadingInitial ? "Loading rate cards..." : "No rate cards found."}
                        </td>
                      </tr>
                    ) : (
                      rateCards.slice(0, visibleCount).map((rate, idx) => (
                        <tr key={rate.id || idx} className="border-b border-gray-100/50 hover:bg-gray-50/50 text-xs">
                          <td className="px-4 py-2 font-medium text-gray-700">{rate.title_name}</td>
                          <td className="px-4 py-2 text-gray-600">{rate.custom_param_1}</td>
                          <td className="px-4 py-2 text-gray-600">{rate.custom_param_2}</td>
                          
                          {/* Placeholder Dropdown */}
                          <td className="px-4 py-2">
                            <select disabled className="w-full bg-gray-100 border border-gray-200 text-gray-400 text-[10px] rounded-md focus:ring-0 focus:border-gray-200 block px-1 py-1 cursor-not-allowed">
                              <option aria-label="None" value=""></option>
                            </select>
                          </td>
                          
                          {/* Placeholder Input */}
                          <td className="px-4 py-2">
                             <input type="text" disabled className="w-full bg-gray-100 border border-gray-200 text-gray-400 text-[10px] rounded-md block px-1 py-1 cursor-not-allowed" />
                          </td>
                          
                          {/* Badge */}
                          <td className="px-4 py-2 text-center">
                            <span className="bg-yellow-100 text-yellow-700 text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap">
                              Missing rate
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2 bg-dark-blue text-white rounded-full text-sm font-medium hover:bg-dark-blue/80 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitPlan;
