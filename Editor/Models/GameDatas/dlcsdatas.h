/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DLCSDATAS_H
#define DLCSDATAS_H

#include <QStringList>
#include "serializable.h"

// -------------------------------------------------------
//
//  CLASS DlcsDatas
//
//  Contains all the activated dlcs of a game. The data file is located in
//  Content/Datas/dlcs.json.
//
// -------------------------------------------------------

class DlcsDatas : public Serializable
{
public:
    static const QString JSON_LIST;
    static const QString JSON_PATH;

    DlcsDatas();
    virtual ~DlcsDatas();
    int dlcsCount() const;
    QString dlcAt(int i) const;
    void deleteDlc(QString dlc);
    void addDlc(QString dlc);
    bool containsDlc(QString dlc);
    QString path() const;
    void setPath(QString p);

    void read(QString path);
    void setDefault();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;
protected:
    QStringList m_list;
    QString m_path;
};

#endif // DLCSDATAS_H
