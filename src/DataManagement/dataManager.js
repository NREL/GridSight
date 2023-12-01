const pl = require('nodejs-polars');

export class timeSeriesLoader {

    constructor(file_path) {

        this.file_path = file_path;
        this.dataFrame = this.loadData(this.file_path);

    }

    loadData(file_path) {
        //var buff = fs.readFileSync(file_path);
        var df =  pl.readParquet(file_path);
        return df
    };

    rowToJSON(index){
        //Returns a json of all columns based on index

        var row = this.dataFrame.row(index)
        var cols = this.dataFrame.columns
        var payload = {}
        for(let i = 0; i < row.length; i++) {
            payload[cols[i]] = row[i]
        }
        return payload
    }

    colToJSON(columns){

        return this.dataFrame.select(columns).toObject()

    }
  }

