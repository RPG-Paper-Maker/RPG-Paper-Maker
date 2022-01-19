/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef PANELGRAPHICS_H
#define PANELGRAPHICS_H

#include <QWidget>
#include "systemstate.h"

namespace Ui {
class PanelGraphics;
}

class PanelGraphics : public QWidget
{
    Q_OBJECT

public:
    explicit PanelGraphics(QWidget *parent = nullptr);
    ~PanelGraphics();
    SystemState * state() const;
    void setState(SystemState *state);
    bool isValueID() const;
    int id() const;
    int indexX() const;
    int indexY() const;
    QRect currentRect() const;

    int getIndex() const;
    void initializeParametersProperties(PrimitiveValue *valueID, QStandardItemModel
        *properties, QStandardItemModel *parameters);
    void passToSprite();
    void passToNone();
    void updateState(SystemState *state);
    void translate();

private:
    Ui::PanelGraphics *ui;
    SystemState *m_state;

public slots:
    void on_comboBoxGraphics_currentIndexChanged(int index);
};

#endif // PANELGRAPHICS_H
