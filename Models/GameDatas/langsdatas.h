/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef LANGSDATAS_H
#define LANGSDATAS_H

#include <QStandardItemModel>
#include "serializable.h"

// -------------------------------------------------------
//
//  CLASS LangDatas
//
//  The data file is located in
//  Content/Datas/langs.json.
//
// -------------------------------------------------------

class LangsDatas : public Serializable
{
public:
    LangsDatas();
    virtual ~LangsDatas();
    void read(QString path);
    QStandardItemModel* model() const;
    void setDefault();
    int mainLang() const;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel* m_model;
};

#endif // LANGSDATAS_H
