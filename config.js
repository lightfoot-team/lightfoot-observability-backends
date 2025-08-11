const fs = require('fs');
const yaml = require('js-yaml');
const { parentPort } = require('worker_threads');

const defaultComposePath = './default.yaml';
const composeDumpPath = './compose.yaml';

const composeUpdates = [
  // [['services', 'prometheus'], 'mem_limit', '512m'],
  // [['services', 'loki'], 'mem_limit', '512m'],
  // [['services', 'tempo'], 'mem_limit', '512m'],
]

const prometheusUpdates = [
  // [['storage', 'tsdb',], 'min-block-duration', '2h'],
  // [['storage', 'tsdb',], 'max-block-duration', '2h'],
  // [['storage', 'tsdb', 'retention'], 'time', '1d'],
  // [['global'], 'scrape_interval', '30s'],
  // [['global'], 'evaluation_interval', '30s'],
]

const OTelUpdates = [
  // [['processors', 'batch'], 'send_batch_size', 100],
  // [['processors', 'batch'], 'send_batch_max_size', 100],
  // [['processors', 'batch'], 'timeout', '5s'],
]

const lokiUpdates = [
  //Automatically drop logs and free indexes
  // [['limits_config'], 'retention_period', '24h'],
  // [['limits_config'], 'volume_enabled', true],
  // //Flush chunks to disk more frequently instead of sitting in memory
  // [['ingester'], 'chunk_idle_period', '30s'],
  // [['ingester'], 'chunk_block_size', 262144],
  // [['ingester'], 'max_chunk_age', '1m']
]

const tempoUpdates = [
  // [['compactor', 'compaction'], 'block_retention', '2h'],
  // //TODO: implement way to remove unwanted receivers instead of just adding here
  // //.     we don't need zipkin or jaeger 
  // [['distributor', 'receivers', 'otlp', 'protocols', 'grpc'], 'endpoint', 'tempo:4317'],
  // [['distributor', 'receivers', 'otlp', 'protocols', 'http'], 'endpoint', 'tempo:4318'],
  // [['ingester'], 'max_block_bytes', '1_000_000'],
  // [['ingester'], 'max_block_duration', '5m'],
  // [['ingester'], 'flush_check_period', '10s'],
  // [['distributor', 'usage', 'cost_attribution'], 'enabled', false],
  // [['storage', 'trace', 'wal'], 'path', '/tmp/tempo/wal'],
  // [['storage', 'trace','local'], 'path', '/tmp/tempo/blocks']
]

function updateConfiguration(sourcePath, destinationPath, updates, overwrite = false) {
  let config = yaml.load(fs.readFileSync(sourcePath, 'utf8'))

  updates.forEach(update => {
    console.log(update, 'update', sourcePath)
    const objectPath = update[0];
    const newPropertyKey = update[1];
    const newPropretyValue = update[2];

    //Traverse the nested properties
    let propertyToModify = null;
    let i = 0;
    let parentProperty = config;

    do {
      if (i > 0) {
        //Move parent property pointer down if it exists 
        if (parentProperty[propertyToModify] !== undefined) {
          parentProperty = parentProperty[propertyToModify];
        }
      } else if (config[objectPath[0]] === undefined) {
        config[objectPath[0]] = {}
      }
      propertyToModify = objectPath[i];
      i++;

    } while (i < objectPath.length);

    if (!overwrite) {
      const existing = parentProperty[propertyToModify];
      parentProperty[propertyToModify] = { ...existing, [newPropertyKey]: newPropretyValue }
    }
  })
  console.log('After', config);
  fs.writeFileSync(destinationPath, yaml.dump(config))
}

updateConfiguration(defaultComposePath, composeDumpPath, composeUpdates);
updateConfiguration('./default-prom-config.yml', './prom-config.yml', prometheusUpdates);
updateConfiguration('./default-otel.yaml', './otel-config.yaml', OTelUpdates);
updateConfiguration('./default-loki.yaml', './loki-config.yaml', lokiUpdates);
updateConfiguration('./default-tempo.yaml', './tempo.yaml', tempoUpdates);