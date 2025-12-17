# Set profile
export CDS_ENV=integration-test

# Set resolved bindings
export cds_requires="$(cds env get requires --resolve-bindings)"

# Run tests
npm run test