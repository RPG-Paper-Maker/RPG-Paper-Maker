/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "fontsdatas.h"
#include "rpm.h"
#include "common.h"

const QString FontsDatas::JSON_LIST = "list";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

FontsDatas::FontsDatas() :
    m_model(new QStandardItemModel)
{

}

FontsDatas::~FontsDatas() {
    SuperListItem::deleteModel(m_model);
}

void FontsDatas::read(QString path) {
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_FONTS_DATAS), *this);
}

QStandardItemModel * FontsDatas::model() const {
    return m_model;
}

void FontsDatas::setModel(QStandardItemModel *model) {
    m_model = model;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void FontsDatas::setDefault() {
    m_model->appendRow((new SystemFont)->getModelRow());
    m_model->appendRow((new SystemFont(1, "Default.ttf", true))->getModelRow());
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void FontsDatas::read(const QJsonObject &json) {
    QJsonArray tab = json[JSON_LIST].toArray();
    QList<QStandardItem *> row;
    SystemFont *font;
    int i, l;

    // Clear
    SuperListItem::deleteModel(m_model, false);

    // Read
    tab = json[JSON_LIST].toArray();

    for (i = 0, l = tab.size(); i < l; i++) {
        font = new SystemFont;
        font->read(tab[i].toObject());
        row = font->getModelRow();
        m_model->appendRow(row);
    }
}

// -------------------------------------------------------

void FontsDatas::write(QJsonObject &json) const {
    SystemFont *font;
    QJsonArray tab;
    QJsonObject obj;
    int i, l;

    for (i = 0, l = m_model->invisibleRootItem()->rowCount(); i < l; i++) {
        font = reinterpret_cast<SystemFont *>(m_model->item(i)->data().value<
            quintptr>());
        font->write(obj);
        tab.append(obj);
    }

    json[JSON_LIST] = tab;
}
