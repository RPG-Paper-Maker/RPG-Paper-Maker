/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QDirIterator>
#include <QtMath>
#include <QJsonObject>
#include <QJsonArray>
#include "common.h"

// -------------------------------------------------------

int Common::versionDifferent(QString projectVersion, QString otherVersion)
{
    int mProject, fProject, bProject, mEngine, fEngine, bEngine;
    bool ok = getSubVersions(projectVersion, mProject, fProject, bProject);
    bool ok2 = getSubVersions(otherVersion, mEngine, fEngine, bEngine);

    // Error while trying to convert one of the versions version
    if (!ok || !ok2)
        return -2;

    // If project <, return -1, if =, return 0, if > return 1
    if (mProject < mEngine)
        return -1;
    else if (mProject > mEngine)
        return 1;
    else {
        if (fProject < fEngine)
            return -1;
        else if (fProject > fEngine)
            return 1;
        else {
            if (bProject < bEngine)
                return -1;
            else if (bProject > bEngine)
                return 1;
            else
                return 0;
        }
    }
}

// -------------------------------------------------------

bool Common::getSubVersions(QString& version, int& m, int& f, int& b) {
    QStringList list = version.split(".");
    if (list.size() != 3)
        return false;
    bool ok;
    int integer;
    integer = list.at(0).toInt(&ok);
    if (!ok)
        return false;
    m = integer;
    integer = list.at(1).toInt(&ok);
    if (!ok)
        return false;
    f = integer;
    integer = list.at(2).toInt(&ok);
    if (!ok)
        return false;
    b = integer;

    return true;
}

// -------------------------------------------------------

void Common::writeRect(QJsonArray &json, const QRect &rect) {
    json.append(rect.x());
    json.append(rect.y());
    json.append(rect.width());
    json.append(rect.height());
}

// -------------------------------------------------------

void Common::readRect(QJsonArray &json, QRect &rect) {
    rect.setX(json[0].toInt());
    rect.setY(json[1].toInt());
    rect.setWidth(json[2].toInt());
    rect.setHeight(json[3].toInt());
}

// -------------------------------------------------------

void Common::writeRectF(QJsonArray &json, const QRectF &rect) {
    json.append(rect.x());
    json.append(rect.y());
    json.append(rect.width());
    json.append(rect.height());
}

// -------------------------------------------------------

void Common::readRectF(QJsonArray &json, QRectF &rect) {
    rect.setX(json[0].toDouble());
    rect.setY(json[1].toDouble());
    rect.setWidth(json[2].toDouble());
    rect.setHeight(json[3].toDouble());
}

// -------------------------------------------------------

void Common::writeOtherJSON(QString path, const QJsonObject &obj, QJsonDocument
    ::JsonFormat format)
{
    QFile saveFile(path);
    if (!saveFile.open(QIODevice::WriteOnly)) {
        return;
    }

    QJsonDocument saveDoc(obj);
    saveFile.write(saveDoc.toJson(format));
    saveFile.close();
}

// -------------------------------------------------------

void Common::readOtherJSON(QString path, QJsonDocument &loadDoc) {
    QByteArray saveDatas;

    QFile loadFile(path);
    loadFile.open(QIODevice::ReadOnly);
    saveDatas = loadFile.readAll();
    loadFile.close();
    loadDoc = QJsonDocument::fromJson(saveDatas);
}

// -------------------------------------------------------

void Common::writeArrayJSON(QString path, const QJsonArray &tab) {
    QFile saveFile(path);
    if (!saveFile.open(QIODevice::WriteOnly)) {
        return;
    }

    QJsonDocument saveDoc(tab);
    saveFile.write(saveDoc.toJson(QJsonDocument::Compact));
    saveFile.close();
}

// -------------------------------------------------------

void Common::readArrayJSON(QString path, QJsonDocument& loadDoc) {
    QByteArray saveDatas;

    QFile loadFile(path);
    loadFile.open(QIODevice::ReadOnly);
    saveDatas = loadFile.readAll();
    loadFile.close();
    loadDoc = QJsonDocument::fromJson(saveDatas);
}

// -------------------------------------------------------

void Common::modifyJSONValue(QJsonObject &root, QString path, QJsonValue value)
{
    QList<QJsonObject> objs;
    QList<QJsonArray> tabs;
    QList<bool> objsOrTabs;
    QStringList list = path.split(".");
    QJsonArray defaultArray;
    QJsonObject obj = root;
    QJsonArray tab = defaultArray;
    QString param;
    QJsonValue tempValue;
    bool isCurrentObj;
    int i, l;

    isCurrentObj = true;
    obj = root;
    for (i = 0, l = list.size(); i < l; i++) {
        param = list.at(i);
        if (isCurrentObj) {
            tempValue = obj[param];
        } else {
            tempValue = tab[param.toInt()];
        }
        isCurrentObj = tempValue.isObject();
        if (isCurrentObj) {
            obj = tempValue.toObject();
            objs.append(obj);
            tabs.append(QJsonArray());
        } else {
            tab = tempValue.toArray();
            objs.append(QJsonObject());
            tabs.append(tab);
        }
        objsOrTabs.append(isCurrentObj);
    }

    QJsonValue final = value;
    for (i = list.size() - 1; i >= 1; i--) {
        param = list.at(i);
        if (objsOrTabs.at(i - 1)) {
            obj = objs.at(i - 1);
            obj[param] = final;
            final = obj;
        } else {
            tab = tabs.at(i - 1);
            tab.replace(param.toInt(), final);
            final = tab;
        }
    }

    root[list.at(0)] = final;
}

// -------------------------------------------------------

QString Common::pathCombine(const QString &p1, const QString &p2) {
    return QDir::cleanPath(p1 + QDir::separator() + p2);
}

// -------------------------------------------------------

bool Common::copyPath(QString src, QString dst) {
    QString dstPath;
    QList<QPair<QString, QString>> symlinks;
    bool b = copyPathSym(symlinks, src, dst);
    if (!b)
    {
        return false;
    }

    #ifdef Q_OS_WIN
        // ...
    #else
    while (!symlinks.isEmpty()) {
        for (int i = symlinks.size() - 1; i >= 0; i--) {
            QPair<QString, QString> pair = symlinks.at(i);
            if (QFile(pair.first).exists() || QDir(pair.first).exists()) {
                QFile::link(pair.first, pair.second);
                symlinks.removeAt(i);
            }
        }
    }
    #endif

    return true;
}

// -------------------------------------------------------

bool Common::copyPathSym(QList<QPair<QString, QString>> &list, QString src,
    QString dst)
{
    QDir dir(src);
    QDir dirDst(dst);
    QString dstPath, path, absolutePath;

    if (!dir.exists()) {
        return false;
    }

    foreach (QFileInfo id, dir.entryInfoList(QDir::Dirs | QDir::NoDotAndDotDot))
    {
        QString d = id.fileName();
        dstPath = pathCombine(dst, d);
        if (id.isSymLink())
        {
            list << QPair<QString, QString>({id.symLinkTarget(), dstPath});
        } else
        {
            if (!dir.mkpath(dstPath)) {
                return false;
            }
            if (!copyPathSym(list, pathCombine(src, d), dstPath)) {
                return false;
            }
        }
    }
    foreach (QFileInfo ifo, dir.entryInfoList(QDir::Files))
    {
        QString f = ifo.fileName();
        dstPath = pathCombine(dst, f);
        if (ifo.isSymLink())
        {
            list << QPair<QString, QString>({ifo.symLinkTarget(), dstPath});
        } else
        {
            if (!QFile::copy(pathCombine(src, f), dstPath)) {
                return false;
            }
        }
    }

    return true;
}

// -------------------------------------------------------

QString Common::getDirectoryPath(QString &file) {
    return QFileInfo(file).dir().absolutePath();
}

// -------------------------------------------------------

bool Common::isDirEmpty(QString path) {
    return QDir(path).entryInfoList(QDir::NoDotAndDotDot | QDir::AllEntries)
        .count() == 0;
}

// -------------------------------------------------------

void Common::copyAllFiles(QString pathSource, QString pathTarget) {
    QDirIterator files(pathSource, QDir::Files);
    QString path;

    while (files.hasNext()) {
        files.next();
        path = Common::pathCombine(pathTarget, files.fileName());
        QFile::remove(path);
        QFile::copy(files.filePath(), path);
    }
}

// -------------------------------------------------------

void Common::deleteAllFiles(QString pathSource) {
    QDirIterator files(pathSource, QDir::Files);

    while (files.hasNext()) {
        files.next();
        QFile(files.filePath()).remove();
    }
}

// -------------------------------------------------------

QString Common::getFormatNumber(int number, int format, int type) {
    return QString("%1").arg(number, format, type, QChar('0'));
}

// -------------------------------------------------------

int Common::modulo(int x, int m) {
    int r = x % m;
    return r < 0 ? r + m : r;
}

// -------------------------------------------------------

int Common::ceil(qreal r) {
    return r < 0 ? qFloor(r) : qCeil(r);
}

// -------------------------------------------------------

QKeySequence Common::getKeySequence(QKeyEvent *event) {
    Qt::KeyboardModifiers modifiers;
    int keyInt;
    Qt::Key key;

    keyInt = event->key();
    key = static_cast<Qt::Key>(keyInt);
    if (key != Qt::Key_unknown) {
        // the user have clicked just and only the special keys Ctrl, Shift,
        // Alt, Meta.
        if (key != Qt::Key_Control && key != Qt::Key_Shift && key != Qt::Key_Alt
            && key != Qt::Key_Meta)
        {
            // check for a combination of user clicks
            modifiers = event->modifiers();
            if (modifiers & Qt::ShiftModifier) {
                keyInt += Qt::SHIFT;
            }
            if (modifiers & Qt::ControlModifier) {
                keyInt += Qt::CTRL;
            }
            if (modifiers & Qt::AltModifier) {
                keyInt += Qt::ALT;
            }
            if (modifiers & Qt::MetaModifier) {
                keyInt += Qt::META;
            }

            return QKeySequence(keyInt);
        }
    }

    return QKeySequence();
}

// -------------------------------------------------------

QString Common::keyToString(int keyInt) {
    Qt::Key key;

    QKeySequence seq(keyInt);
    key = static_cast<Qt::Key>(keyInt);
    if (key != Qt::Key_unknown) {
        switch (key) {
        case Qt::Key_Control:
            return "CTRL";
        case Qt::Key_Shift:
            return "SHIFT";
        case Qt::Key_Alt:
            return "ALT";
        case Qt::Key_Meta:
            return "META";
        case Qt::Key_AltGr:
            return "ALTGR";
        default:
            return seq.toString();
        }
    }

    return "?";
}

// -------------------------------------------------------

bool Common::isPressingEnter(QKeyEvent *event) {
    return event->key() == Qt::Key_Space || event->key() == Qt::Key_Enter ||
        event->key() == Qt::Key_Return;
}

// -------------------------------------------------------

bool Common::getMinDistance(float& finalDistance, float newDistance) {
    if (std::isnan(finalDistance)) {
        finalDistance = 0;
    }
    if (std::isnan(newDistance)) {
        newDistance = 0;
    }
    if (finalDistance == 0.0f) {
        if (newDistance > 0) {
            finalDistance = newDistance;
            return true;
        }
    } else {
        if (newDistance > 0) {
            if (newDistance < finalDistance) {
                finalDistance = newDistance;
                return true;
            }
        }
    }

    return false;
}

// -------------------------------------------------------

QPoint Common::rotatePoint(int x, int y, int cx, int cy, double angle) {
      double s, c, xNew, yNew;

      s = qSin(angle * (M_PI / 180.0));
      c = qCos(angle * (M_PI / 180.0));

      // translate point back to origin:
      x -= cx;
      y -= cy;

      // rotate point
      xNew = x * c - y * s;
      yNew = x * s + y * c;

      // translate point back:
      x = qRound(xNew + cx);
      y = qRound(yNew + cy);

      return QPoint(x, y);
}
