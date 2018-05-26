/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#ifndef COMMON_H
#define COMMON_H

#include <QJsonDocument>

class Common
{
public:
    Common();

    // METHODS
    static QString pathCombine(const QString& p1, const QString& p2);
    static void writeOtherJSON(QString path, const QJsonObject &obj,
                               QJsonDocument::JsonFormat format
                               = QJsonDocument::Compact);
    static void readOtherJSON(QString path, QJsonDocument& loadDoc);
    static void writeArrayJSON(QString path, const QJsonArray &tab);
    static void readArrayJSON(QString path, QJsonDocument& loadDoc);
    static bool copyPath(QString src, QString dst);
    static QString getDirectoryPath(QString& file);
    static bool isDirEmpty(QString path);
    static void copyAllFiles(QString pathSource, QString pathTarget);
    static void copyAll(QString pathSource, QString pathTarget);
    static void deleteAllFiles(QString pathSource);
    static QString getFormatNumber(int number, int format = 4, int type = 10);
    static bool getSubVersions(QString& version, int& m, int& f, int& b);
    static int versionDifferent(QString projectVersion, QString otherVersion);
};

#endif // COMMON_H
