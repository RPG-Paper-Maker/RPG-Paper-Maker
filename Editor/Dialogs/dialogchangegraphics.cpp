/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogchangegraphics.h"
#include "ui_dialogchangegraphics.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogChangeGraphics::DialogChangeGraphics(PrimitiveValue *valueID,
    QStandardItemModel *properties, QStandardItemModel *parameters, int id, int
    index, bool dontChangeOrientation, int indexX, int indexY, QRect currentRect,
    QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogChangeGraphics)
{
    ui->setupUi(this);
    MapEditorSubSelectionKind kind = MapEditorSubSelectionKind::None;
    switch (index)
    {
    case 0:
        kind = MapEditorSubSelectionKind::None;
        break;
    case 1:
        kind = MapEditorSubSelectionKind::SpritesFix;
        break;
    case 2:
        kind = MapEditorSubSelectionKind::SpritesFace;
        break;
    case 3:
        kind = MapEditorSubSelectionKind::Object3D;
        break;
    }
    m_state.setGraphicsKind(kind);
    m_state.setGraphicsId(id);
    m_state.setIndexX(indexX);
    m_state.setIndexY(indexY);
    m_state.setRectTileset(currentRect);
    ui->panelGraphics->setState(&m_state);
    ui->panelGraphics->updateState(&m_state);
    ui->panelGraphics->initializeParametersProperties(valueID, properties, parameters);
    ui->checkBox->setChecked(dontChangeOrientation);
    this->translate();
}

DialogChangeGraphics::~DialogChangeGraphics()
{
    delete ui;
}

bool DialogChangeGraphics::isValueID() const
{
    return ui->panelGraphics->isValueID();
}

int DialogChangeGraphics::id() const
{
    return m_state.graphicsId();
}

int DialogChangeGraphics::indexX() const
{
    return m_state.indexX();
}

int DialogChangeGraphics::indexY() const
{
    return m_state.indexY();
}

QRect DialogChangeGraphics::currentRect() const
{
    return m_state.rectTileset();
}

bool DialogChangeGraphics::dontChangeOrientation() const
{
    return ui->checkBox->isChecked();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

int DialogChangeGraphics::getIndex() const
{
    return ui->panelGraphics->getIndex();
}

// -------------------------------------------------------

void DialogChangeGraphics::translate()
{
    this->setWindowTitle(RPM::translate(Translations::CHANGE_GRAPHICS) + RPM
        ::DOT_DOT_DOT);
    ui->panelGraphics->translate();
    ui->checkBox->setText(RPM::translate(Translations::DONT_CHANGE_ORIENTATION));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
