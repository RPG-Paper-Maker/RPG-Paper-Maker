/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef COMMON_H
#define COMMON_H

#include <QJsonDocument>

class Common
{
public:
    Common();

    // Enums to QString
    static const QStringList enumToStringDamagesKind;
    static const QStringList enumToStringEffectSpecialActionKind;
    static const QStringList enumToStringIncreaseDecreaseKind;

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
    static int modulo(int x, int m);
};

#endif // COMMON_H
