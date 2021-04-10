/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef PANELCOLORSTRANSITION_H
#define PANELCOLORSTRANSITION_H

#include <QWidget>
#include "eventcommand.h"

// -------------------------------------------------------
//
//  CLASS PanelColorsTransition
//
//  The panel colors for screen tone and flash screen.
//
// -------------------------------------------------------

namespace Ui {
class PanelColorsTransition;
}

class PanelColorsTransition : public QWidget
{
    Q_OBJECT

public:
    explicit PanelColorsTransition(QWidget *parent = nullptr);
    ~PanelColorsTransition();

    void initializePrimitives(QStandardItemModel *properties, QStandardItemModel
        *parameters);
    void initialize(EventCommand *command, int &i);
    void getCommand(QVector<QString> &command) const;
    void translate();

protected:
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;

private:
    Ui::PanelColorsTransition *ui;

public slots:
    void on_checkBoxColor_toggled(bool checked);
    void on_spinBoxRedValueChanged(int value);
    void on_horizontalSliderRed_valueChanged(int value);
    void on_spinBoxGreenValueChanged(int value);
    void on_horizontalSliderGreen_valueChanged(int value);
    void on_spinBoxBlueValueChanged(int value);
    void on_horizontalSliderBlue_valueChanged(int value);
    void on_spinBoxGreyValueChanged(int value);
    void on_horizontalSliderGrey_valueChanged(int value);
};

#endif // PANELCOLORSTRANSITION_H
