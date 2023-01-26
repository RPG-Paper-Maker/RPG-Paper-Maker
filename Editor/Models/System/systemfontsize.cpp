/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemfontsize.h"

const QString SystemFontSize::JSON_SIZE = "s";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemFontSize::SystemFontSize() :
    SystemFontSize(-1, "", new PrimitiveValue(0))
{

}

SystemFontSize::SystemFontSize(int i, QString n, PrimitiveValue *s) :
    SuperListItem(i, n),
    m_size(s)
{

}

SystemFontSize::~SystemFontSize() {
    delete m_size;
}

PrimitiveValue * SystemFontSize::size() const {
    return m_size;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemFontSize::openDialog() {
    SystemFontSize fontsize;
    fontsize.setCopy(*this);
    DialogSystemFontSize dialog(fontsize);

    if (dialog.exec() == QDialog::Accepted) {
        setCopy(fontsize);
        return true;
    }

    return false;
}

// -------------------------------------------------------

SuperListItem * SystemFontSize::createCopy() const {
    SystemFontSize *super = new SystemFontSize;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemFontSize::setCopy(const SuperListItem &super) {
    const SystemFontSize *fontsize;

    SuperListItem::setCopy(super);

    fontsize = reinterpret_cast<const SystemFontSize *>(&super);
    m_size->setCopy(*fontsize->m_size);
}

// -------------------------------------------------------

void SystemFontSize::read(const QJsonObject &json) {
    SuperListItem::read(json);

    if (json.contains(JSON_SIZE)) {
        m_size->read(json[JSON_SIZE].toObject());
    }
}

// -------------------------------------------------------

void SystemFontSize::write(QJsonObject &json) const {
    QJsonObject obj;

    SuperListItem::write(json);

    if (!m_size->isDefaultNumberValue()) {
        obj = QJsonObject();
        m_size->write(obj);
        json[JSON_SIZE] = obj;
    }
}
