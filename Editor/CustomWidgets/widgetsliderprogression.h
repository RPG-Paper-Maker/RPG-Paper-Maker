/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETSLIDERPROGRESSION_H
#define WIDGETSLIDERPROGRESSION_H

#include <QWidget>

// -------------------------------------------------------
//
//  CLASS WidgetSliderProgression
//
//  Widget used for slider progression (slow, linear, fast).
//
// -------------------------------------------------------

namespace Ui {
class WidgetSliderProgression;
}

class WidgetSliderProgression : public QWidget
{
    Q_OBJECT

public:
    explicit WidgetSliderProgression(QWidget *parent = nullptr);
    ~WidgetSliderProgression();

    int equation() const;
    void setEquation(int e);

private:
    Ui::WidgetSliderProgression *ui;

    void translate();

signals:
    void equationChanged(int e);

public slots:
    void on_horizontalSlider_valueChanged(int i);
};

#endif // WIDGETSLIDERPROGRESSION_H
