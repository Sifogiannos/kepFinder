#kepFinder

To kepFinder είναι μια web εφαρμογή αναζήτησης των πλησιέστερων KΕΠ με βάση την τοποθεσία που βρίσκεται ο χρήστης, χρησιμοποιόντας τις τοποθεσίες των πλησιέστερων ΚΕΠ απο το ανάλογο dataset.

##Dependacies

You must have installed NodeJS and MongoDB

##Import database form CSV file

```bash
$ mongoimport --db findnearestkeps --collection keps --type csv --headerline --file ./helpfulFiles/kepsDatabase.csv
```

##Start the application

###For Windows/OSX

```bash
node app.js
```

###For Unix

```bash
nodejs app.js
```