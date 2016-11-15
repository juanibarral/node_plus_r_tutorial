
require(RJSONIO)

clusterData <- function(raw_data){
	mydata <- fromJSON(raw_data)

	mydata <- scale(mydata)
	fit <- kmeans(mydata, 4)
	aggregate(mydata,by=list(fit$cluster),FUN=mean)
	mydata <- data.frame(mydata, fit$cluster)

	res <- list(
		"clustered_data" = mydata
		)
	return(toJSON(res))
}