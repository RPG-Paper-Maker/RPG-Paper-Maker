/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    static int ceil(qreal r);
};

#endif // COMMON_H
