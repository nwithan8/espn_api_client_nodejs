Documentation
=============

The ``League`` class
******************
.. autoclass:: espn_api_client.core.League
    :members: league, sport, teams, conferences, baseUrl, currentGames

The ``Team`` class
********************
.. autoclass:: espn_api_client.Team
    :members: teamID, teamNickname, league, sport, baseUrl, schedule, conferenceID, subConferenceID, statistics, record, teamLogoURL

The ``Game`` class
********************
.. autoclass:: espn_api_client.Game
    :members: gameID, league, sport, baseUrl, awayTeam, homeTeam, score, winProbabilityPercentage, winProbabilityTeam, spread, overUnder
