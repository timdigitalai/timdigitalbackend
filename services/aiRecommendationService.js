const getRecommendations = (preferences) => {
  // Sample AI-based recommendation logic
  const recommendedBusinesses = [
    { name: 'Business 1', category: 'Restaurant', location: 'NYC', rating: 4.5 },
    { name: 'Business 2', category: 'Salon', location: 'LA', rating: 4.7 },
    { name: 'Business 3', category: 'Gym', location: 'Chicago', rating: 4.2 },
  ];

  // Debugging: log the user preferences
  console.log('User Preferences:', preferences);

  // Filter based on user preferences
  const filteredBusinesses = recommendedBusinesses.filter(business => {
      const categoryMatch = preferences.preferredCategories.includes(business.category);
      const ratingMatch = business.rating >= preferences.preferredRating;

      // Debugging: log the individual match conditions
      console.log(`Checking business: ${business.name}, Category match: ${categoryMatch}, Rating match: ${ratingMatch}`);

      return categoryMatch && ratingMatch;
  });

  // Debugging: log the final filtered businesses
  console.log('Filtered Businesses:', filteredBusinesses);

  return filteredBusinesses;
};

module.exports = { getRecommendations };
