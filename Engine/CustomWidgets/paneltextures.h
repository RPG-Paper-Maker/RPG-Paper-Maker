#ifndef PANELTEXTURES_H
#define PANELTEXTURES_H

#include <QWidget>

namespace Ui {
class PanelTextures;
}

class PanelTextures : public QWidget
{
    Q_OBJECT

public:
    explicit PanelTextures(QWidget *parent = 0);
    ~PanelTextures();

private:
    Ui::PanelTextures *ui;
};

#endif // PANELTEXTURES_H
