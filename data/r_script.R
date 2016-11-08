require(RJSONIO)

getHistogram <- function(raw_data){
	d <- fromJSON(raw_data)
	h <- hist(d)

	res <- list(
		"histogram" = h)
	return(toJSON(res))
}