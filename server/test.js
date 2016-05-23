/**
 * Created by s126763 on 19-5-2016.
 */
Meteor.methods({
    parallelAsyncJob: function(message) {

        // We're going to make http get calls to each url
        var urls = [
            'http://google.com',
            'http://news.ycombinator.com',
            'https://github.com'
        ];



            // Set up a future for the current job
            var future = new Future();

                      /// Make async http call
            Meteor.http.get(url, function(error, result) {

                // Do whatever you need with the results here!

                // Inform the future that we're done with it
                future.resolver(error, result);
            });

            // Return the future
        return future;
        Future.wait(future);
    }
});