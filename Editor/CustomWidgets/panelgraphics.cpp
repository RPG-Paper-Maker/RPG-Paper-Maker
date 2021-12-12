/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "panelgraphics.h"
#include "ui_panelgraphics.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelGraphics::PanelGraphics(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelGraphics),
    m_state(nullptr)
{
    ui->setupUi(this);

    ui->comboBoxGraphics->addItem(RPM::translate(Translations::NONE));
    ui->comboBoxGraphics->addItem(RPM::translate(Translations::FIX_SPRITE));
    ui->comboBoxGraphics->addItem(RPM::translate(Translations::FACE_SPRITE));
    ui->comboBoxGraphics->addItem(RPM::translate(Translations::THREED_OBJECT));
}

PanelGraphics::~PanelGraphics()
{
    delete ui;
}

SystemState * PanelGraphics::state() const
{
    return m_state;
}

void PanelGraphics::setState(SystemState *state)
{
    m_state = state;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelGraphics::passToSprite()
{
    ui->comboBoxGraphics->setCurrentIndex(2);
}

// -------------------------------------------------------

void PanelGraphics::passToNone()
{
    ui->comboBoxGraphics->setCurrentIndex(0);
}

// -------------------------------------------------------

void PanelGraphics::updateState(SystemState *state)
{
    ui->frameGraphics->setState(state);
    int i = 0;
    switch (state->graphicsKind()) {
    case MapEditorSubSelectionKind::None:
        i = 0; break;
    case MapEditorSubSelectionKind::SpritesFix:
        i = 1; break;
    case MapEditorSubSelectionKind::SpritesFace:
        i = 2; break;
    case MapEditorSubSelectionKind::Object3D:
        i = 3; break;
    default:
        break;
    }
    int id = state->graphicsId();
    ui->comboBoxGraphics->setCurrentIndex(i);
    state->setGraphicsId(id);
    if (state->graphicsKind() == MapEditorSubSelectionKind::Object3D)
    {
        ui->frameGraphics->updateCurrentObject();
    } else {
        ui->frameGraphics->clearObject();
    }
    ui->frameGraphics->repaint();
}

// -------------------------------------------------------

void PanelGraphics::translate()
{
    ui->labelGraphics->setText(RPM::translate(Translations::GRAPHICS) + RPM::COLON);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelGraphics::on_comboBoxGraphics_currentIndexChanged(int index)
{
    if (m_state == nullptr)
    {
        return;
    }
    MapEditorSubSelectionKind kind = MapEditorSubSelectionKind::None;
    switch (index) {
    case 0:
        kind = MapEditorSubSelectionKind::None; break;
    case 1:
        kind = MapEditorSubSelectionKind::SpritesFix;
        if (m_state->graphicsKind() != MapEditorSubSelectionKind::SpritesFace)
        {
            m_state->setGraphicsId(1);
        }
        ui->frameGraphics->clearObject();
        break;
    case 2:
        kind = MapEditorSubSelectionKind::SpritesFace;
        if (m_state->graphicsKind() != MapEditorSubSelectionKind::SpritesFix)
        {
            m_state->setGraphicsId(1);
        }
        ui->frameGraphics->clearObject();
        break;
    case 3:
        kind = MapEditorSubSelectionKind::Object3D;
        m_state->setGraphicsId(1);
        ui->frameGraphics->updateCurrentObject();
        break;
    }
    m_state->setGraphicsKind(kind);
    ui->frameGraphics->repaint();
}
