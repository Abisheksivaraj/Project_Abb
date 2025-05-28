@echo off
echo Resetting Database...

mongo project_abb_db --eval "db.dropDatabase()"

echo Database reset complete!
pause