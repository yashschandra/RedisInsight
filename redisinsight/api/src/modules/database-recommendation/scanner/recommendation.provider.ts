import { Injectable, Logger } from '@nestjs/common';
import { IRecommendationStrategy } from
  'src/modules/database-recommendation/scanner/recommendation.strategy.interface';
import { RECOMMENDATION_NAMES } from 'src/constants';
import { DatabaseService } from 'src/modules/database/database.service';
import {
  DefaultRecommendationStrategy,
  RedisVersionStrategy,
  SearchJSONStrategy,
  BigSetStrategy,
  RTSStrategy,
  AvoidLogicalDatabasesStrategy,
  ShardHashStrategy,
  StringToJsonStrategy,
  SearchVisualizationStrategy,
  UseSmallerKeysStrategy,
  AvoidLuaScriptsStrategy,
  BigStringStrategy,
  CompressionForListStrategy,
  BigAmountConnectedClientsStrategy,
  FunctionsWithStreamsStrategy,
  FunctionsWithKeyspaceStrategy,
  LuaToFunctionsStrategy,
} from 'src/modules/database-recommendation/scanner/strategies';

@Injectable()
export class RecommendationProvider {
  private logger = new Logger('ZSetTypeInfoStrategy');

  private strategies: Map<string, IRecommendationStrategy> = new Map();

  constructor(
    databaseService: DatabaseService,
  ) {
    this.strategies.set('default', new DefaultRecommendationStrategy());
    this.strategies.set(RECOMMENDATION_NAMES.REDIS_VERSION, new RedisVersionStrategy());
    this.strategies.set(RECOMMENDATION_NAMES.SEARCH_JSON, new SearchJSONStrategy(databaseService));
    this.strategies.set(RECOMMENDATION_NAMES.BIG_SETS, new BigSetStrategy());
    this.strategies.set(RECOMMENDATION_NAMES.RTS, new RTSStrategy());
    this.strategies.set(RECOMMENDATION_NAMES.AVOID_LOGICAL_DATABASES, new AvoidLogicalDatabasesStrategy());
    this.strategies.set(RECOMMENDATION_NAMES.BIG_HASHES, new ShardHashStrategy());
    this.strategies.set(RECOMMENDATION_NAMES.STRING_TO_JSON, new StringToJsonStrategy());
    this.strategies.set(RECOMMENDATION_NAMES.SEARCH_VISUALIZATION, new SearchVisualizationStrategy());
    this.strategies.set(RECOMMENDATION_NAMES.USE_SMALLER_KEYS, new UseSmallerKeysStrategy());
    this.strategies.set(RECOMMENDATION_NAMES.LUA_SCRIPT, new AvoidLuaScriptsStrategy());
    this.strategies.set(RECOMMENDATION_NAMES.BIG_STRINGS, new BigStringStrategy());
    this.strategies.set(RECOMMENDATION_NAMES.COMPRESSION_FOR_LIST, new CompressionForListStrategy());
    this.strategies.set(RECOMMENDATION_NAMES.BIG_AMOUNT_OF_CONNECTED_CLIENTS, new BigAmountConnectedClientsStrategy());
    this.strategies.set(RECOMMENDATION_NAMES.FUNCTIONS_WITH_STREAMS, new FunctionsWithStreamsStrategy(databaseService));
    this.strategies.set(RECOMMENDATION_NAMES.LUA_TO_FUNCTIONS, new LuaToFunctionsStrategy(databaseService));
    this.strategies.set(RECOMMENDATION_NAMES.FUNCTIONS_WITH_KEYSPACE,
      new FunctionsWithKeyspaceStrategy(databaseService));
  }

  getStrategy(type: string): IRecommendationStrategy {
    this.logger.log(`Getting ${type} recommendation strategy.`);

    const strategy = this.strategies.get(type);

    if (!strategy) {
      this.logger.error(`Failed to get ${type} recommendation strategy.`);
      return this.strategies.get('default');
    }

    return strategy;
  }
}
