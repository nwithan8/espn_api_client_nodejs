Documentation
=============

The ``League`` class
******************
.. js:autoclass:: espn_api_client.League
    :members: league, sport, teams, conferences, baseUrl, currentGames

.. js:autofunction:: espn_api.client.Rankings()

.. js:autofunction:: getNews()

The ``Team`` class
********************
.. js:autoclass:: espn_api_client.Team
    :members: teamID, teamNickname, league, sport, baseUrl, schedule, conferenceID, subConferenceID, statistics, record, teamLogoURL

The ``Game`` class
********************
.. js:autoclass:: espn_api_client.Game
    :members: gameID, league, sport, baseUrl, awayTeam, homeTeam, score, winProbabilityPercentage, winProbabilityTeam, spread, overUnder
