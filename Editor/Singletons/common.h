/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef COMMON_H
#define COMMON_H

#include <QJsonDocument>
#include <QRectF>
#include <QKeySequence>
#include <QKeyEvent>

// -------------------------------------------------------
//
//  CLASS Common
//
//  Special static class containing common methods.
//
// -------------------------------------------------------

class Common
{
public:
    static int versionDifferent(QString projectVersion, QString otherVersion);
    static bool getSubVersions(QString &version, int &m, int &f, int &b);
    static void writeRect(QJsonArray &json, const QRect &rect);
    static void readRect(QJsonArray &json, QRect &rect);
    static void writeRectF(QJsonArray &json, const QRectF &rect);
    static void readRectF(QJsonArray &json, QRectF &rect);
    static void writeOtherJSON(QString path, const QJsonObject &obj,
        QJsonDocument::JsonFormat format = QJsonDocument::Compact);
    static void readOtherJSON(QString path, QJsonDocument &loadDoc);
    static void writeArrayJSON(QString path, const QJsonArray &tab);
    static void readArrayJSON(QString path, QJsonDocument &loadDoc);
    static void modifyJSONValue(QJsonObject &root, QString path, QJsonValue
        value);
    static QString pathCombine(const QString &p1, const QString &p2);
    static bool copyPath(QString src, QString dst);
    static QString getDirectoryPath(QString &file);
    static bool isDirEmpty(QString path);
    static void copyAllFiles(QString pathSource, QString pathTarget);
    static void deleteAllFiles(QString pathSource);
    static QString getFormatNumber(int number, int format = 4, int type = 10);
    static int modulo(int x, int m);
    static int ceil(qreal r);
    static QKeySequence getKeySequence(QKeyEvent *event);
    static QString keyToString(int keyInt);
    static bool isPressingEnter(QKeyEvent *event);
    static bool getMinDistance(float &finalDistance, float newDistance);
    static QPoint rotatePoint(int x, int y, int cx, int cy, double angle);
};

#endif // COMMON_H
